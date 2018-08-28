const model = require('./model');
const async = require('async');
const bcrypt = require('bcryptjs');
const validations = require('./validations');
const nodemailer = require('nodemailer');
const parser = require('xml2json');
const config = require('./config')
const request = require('request');
var Hotwire = require('hotwire');

var hotwire = new Hotwire(config.hotwire_key);


var flight_data = {
	"fromLocation": "IXC",
	"toLocation": "DUB",
	"departureDate": "2018-08-24T00:00:00",
	"persons": [
		{
			"passengerType": "ADT",
			"quantity": 2
		},
		{
			"passengerType": "CHD",
			"quantity": 1
		}
	],
	"userData": {
		"ip": "192.168.0.1",
		"browser_agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:46.0) Gecko/20100101 Firefox/46.0"
	}
}

var cars_data = {
	'airport_code': 'LHR',
	'start_date': '2018-09-01T00:00:00Z',
	'end_date': '2018-09-04T00:00:00Z',
	'filters': {
		'type': [
			'crossover'
		]
	}
};


function modifyUrl(res, details) {
	let baseUrl = config.goIbibo_base;
	let { source, destination, dateofdeparture, seatingclass, adults, children = 0, infants = 0, counter = 100 } = details;
	let sm = { source, destination, dateofdeparture, seatingclass, adults, children, infants, counter }
	if (!details.source || !details.destination || !details.dateofdeparture || !details.seatingclass || !details.adults) {
		return false
	} else {
		let iterate_obj = sm;
		for (var i in iterate_obj) {
			baseUrl = baseUrl.concat(`&${i}=${iterate_obj[i]}`)
		}
		return baseUrl
	}
}

module.exports = {
	createUser: function (req, res) {

		async.waterfall([
			function (callback) {
				model.findOne({ $or: [{ email_id: req.body.email_id, status: 'ACTIVE' }, { username: req.body.username, status: 'ACTIVE' }] }, (err, data) => {
					err ? callback({ code: 500, message: "Internal server error" }) : data ? callback({ code: 400, message: "Email or Username already exists." }) : callback(null, data);
				})
			}, (data, callback) => {
				console.log('has no data');
				var Model = new model(req.body);
				Model.save((err, data) => {
					if (err) callback({ code: 500, message: "Internal server error" })
					else
						callback(null, 'done')
				})
			}
		], (err, data) => {
			if (err) {
				return res.json(err);
			} else {
				return res.json({ code: 201, message: "Registration Successful." })
			}
		})

	},
	checkLogin: function (req, res) {
		async.waterfall([
			function (callback) {
				model.findOne({ username: req.body.username, status: 'ACTIVE', type: 'normal' }, (err, data) => {
					err ? callback({ code: 500, message: "Internal server error" }) : (!data) ? callback({ code: 400, message: "Username is not exist." }) : callback(null, data)
				})
			}, function (code, callback) {
				bcrypt.compare(req.body.password, code.password, (err, match) => {
					err ? callback({ code: 500, message: "Internal server error" }) : (!match) ? callback({ code: 400, message: "Password is not correct." }) : callback(null, code);
				})
			}, function (modify, callback) {
				validations.mapLogin(modify, (modified) => callback(null, modified))
			},
		], function (err, result) {
			if (err) return res.json(err)
			else {
				return res.json({ code: 200, message: "Success", data: result })
			}

		})


	},
	forgot_password: function (req, res) {

		async.waterfall([

			function (cb) {
				if (req.body.email_id) {
					model.findOne({ email_id: req.body.email_id, status: 'ACTIVE' }, (err, result) => {
						(err) ? cb({ code: 500, message: "Internal server error" }) : (!result) ? cb({ code: 400, message: "Email not found." }) : cb(null, result)
					})
				}

			}, function (data, cb) {
				validations.getRandomPassword((pass) => {
					cb(null, pass.toString())
				});
			},
			function (pass, cb) {
				validations.convertPass(pass).then(new_pass => cb(null, new_pass, pass))
			},

			function (pass, new_ps, cb) {
				console.log('new pass==>' + pass)
				model.findOneAndUpdate({ email_id: req.body.email_id, status: 'ACTIVE' }, { $set: { password: pass } }, { new: true }, (err, new_pass) => {
					(err) ? cb({ code: 500, message: "Internal server error" }) : cb(null, new_ps)
				})

			}, function (new_pass, callback) {
				var transporter = nodemailer.createTransport({
					pool: true,
					host: 'smtp.gmail.com',
					port: 465,
					secure: true,
					auth: {
						// type:'PLAIN',
						user: 'vishal.rana@codezeros.com', // generated ethereal user
						pass: 'codezero#' // generated ethereal password
					}
				})

				let mailOptions = {
					from: '"Codezeros 👻" <vishal.rana@codezeros.com>', // sender address
					to: req.body.email_id, // list of receivers
					subject: 'New Password request', // Subject line
					text: 'Please find your new password.', // plain text body
					html: `<b> ${new_pass}</b>` // html body
				};

				// send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						console.log(error)
						callback({ code: 500, message: "Internal server error" })
					} else {
						console.log(info)
						callback(null, 'done')
					}
				});
			}

		], function (err, data) {
			if (err) return res.json(err)
			else {
				return res.json({ code: 200, message: "New password has been sent to your email account." })
			}
		})
	},

	checkUser: (req, res) => {
		let { username } = req.query;
		model.findOne({ username: username, status: 'ACTIVE' }, (err, usernameExist) => {
			(err) ? res.json({ code: 500, message: "Internal server error" }) : (!usernameExist) ? res.json({ status: true, message: "Username not found." }) : res.json({ status: false, message: "Username already exists." })
		})

	},
	loginFb: (req, res) => {
		let { fb_id } = req.body;
		async.waterfall([
			function (cb) {
				model.findOne({ fb_id: fb_id, status: 'ACTIVE' }, (err, fb_exist) => {
					(err) ? cb({ code: 500, message: "Internal server error" }) : (!fb_exist) ? cb(null, req.body) : cb({ code: 200, message: "Success.", data: fb_exist })
				})
			}, (data, cb) => {
				console.log(data);
				var Model = new model(data);
				Model.save((err, new_entry) => {
					(err) ? cb({ code: 500, message: "Internal server error" }) : cb(null, { code: 200, message: 'Success', data: new_entry })
				})
			}
		], (err, result) => {
			(err) ? res.json(err) : res.json(result)
		})

	},

	//this function is calling on the basis of static origin
	getAvailableHotels: (req, res) => {
		let url = `http://api.hotwire.com/v1/deal/hotel?dest=chicago&apikey=${config.hotwire_key}&limit=20&format=json`;
		console.log(url)
		request.get(url, (err, response, body) => {
			console.log(typeof body);
			if (err) { return res.json({ code: 200, message: "Internal server error" }) } else
				return res.json({ code: 200, result: JSON.parse(body) })
		})
	},

	checkHotels: async (req, res) => {
		console.log("details", req.body);

		let obj = {
			url: `https://dev.allmyles.com/v2.0/hotels`,
			headers: {
				"content-type": "application/json",
				"X-Auth-Token": config.allmyles_key,
				"Cookie": "8923769hsfosdyf"
			},
			body: JSON.stringify(req.body)

		}

		return await hotelDetails(req, res, obj);
	},

	checkFlights: async (req, res) => {
		// let modifyed_url = modifyUrl(res, req.body);
		// console.log(modifyed_url)
		let obj = {
			url: `https://dev.allmyles.com/v2.0/flights`,
			headers: {
				"content-type": "application/json",
				"X-Auth-Token": config.allmyles_key,
				"Cookie": "8923769hsfosdyf"
			},
			body: JSON.stringify(req.body)

		}

		return await flightDetails(req, res, obj);

	},

	// checkCarRental: async (req, res) => {
		
	// 	let obj = {
	// 		url: `https://dev.allmyles.com/v2.0/cars`,
	// 		headers: {
	// 			"content-type": "application/json",
	// 			//"X-Auth-Token": config.allmyles_key,
	// 			"X-Auth-Token": config.sabre_key,
	// 			"Cookie": "8923769hsfosdyf"
	// 		},
	// 		body: JSON.stringify(req.body)

	// 	}

	// 	return await carsDetails(req, res, obj);

	// },
	checkCarRental:(req,res)=>{
		let obj={
			url:``,
			
		}
	}
}

async function flightDetails(req, res, obj) {

	console.log('calling time')
	request.post(obj, (err, response, body) => {
		if (err) {
			return res.json({ code: 200, message: "Internal server error" })
		} else {
			console.log(response.statusCode)
			if (response.statusCode == 202) {
				return flightDetails(req, res, obj);
			} else
				return res.json({ code: 200, result: JSON.parse(body) })
		}
	})
}

async function carsDetails(req, res, obj) {

	request.post(obj, (err, response, body) => {
		if (err) {
			return res.json({ code: 200, message: "Internal server error" })
		} else {
			if (response.statusCode == 202) {
				return carsDetails(req, res, obj);
			} else {
				return res.json({ code: 200, result: JSON.parse(body) })
			}
		}
	})
}

async function hotelDetails(req, res, obj) {
	request.post(obj, (err, response, body) => {
		if (err) {
			return res.json({ code: 200, message: "Internal server error" })
		} else {
			if (response.statusCode == 202) {
				return hotelDetails(req, res, obj);
			} else {
				return res.json({ code: 200, result: JSON.parse(body) })
			}
		}
	})
}
