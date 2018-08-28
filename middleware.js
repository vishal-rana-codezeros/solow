
const validation = require('./validations')

function register(req, res, next) {

	let { fullname, username, email_id, password, fb_id, type } = req.body;
	let error = [];
	if (!fullname) {
		error.push({ code: 500, message: "Full name is required." })
	}
	else if (!username) {
		error.push({ code: 500, message: "User name is required." })
	}
	else if (!email_id) {
		error.push({ code: 500, message: "Email is required." })
	} else if (!password) {
		error.push({ code: 500, message: "Password is required." })
	}
	else if (!validation.validateEmail(email_id)) {
		error.push({ code: 500, message: "Please provide valid email." })
	}
	else if (fb_id) {
		error.push({ code: 500, message: "Fb id is not required." })
	}
	else if (type && type == 'facebook') {
		error.push({ code: 500, message: "Type needs to be normal." })
	}


	if (error.length > 0) {
		errors(error, res);
	} else
		next();


}

function checkLogin(req, res, next) {
	let { username, password } = req.body;
	let error = [];
	if (!username) {
		error.push({ code: 500, message: "Username is required." })
	}
	else if (!password) {
		error.push({ code: 500, message: "Password is required." })
	}

	if (error.length > 0) {
		errors(error, res);
	} else
		next();
}

function checkUser(req, res, next) {
	let { username } = req.query;
	let error = [];
	if (!username) {
		error.push({ code: 500, message: "Username is required." })
	}

	if (error.length > 0) {
		errors(error, res);
	} else
		next();
}


function checkFbLogin(req, res, next) {
	let { fb_id, type } = req.body;
	let error = [];

	if (!fb_id) {
		error.push({ code: 500, message: "Facebook id is required." })
	}
	else if (!type || type != 'facebook') {
		error.push({ code: 500, message: "Provide a type." })
	}

	if (error.length > 0) {
		errors(error, res);
	} else
		next();

}
function makeRequestValid(req, res, next) {
	let error = [];
	let { fromLocation, toLocation, departureDate, returnDate, persons } = req.body;
	if (!fromLocation) {
		error.push({ code: 400, message: "provide source." })
	} else if (!toLocation) {
		error.push({ code: 400, message: "provide destination." })
	} else if (!departureDate) {
		error.push({ code: 400, message: "provide date of departure." })
	} else if (!returnDate) {
		error.push({ code: 400, message: "provide seating class." })
	}
	else if (!persons) {
		error.push({ code: 400, message: "provide no of passengers." })
	}

	if (error.length > 0) {
		errors(error, res);
	} else
		next();
}

function errors(err, res) {
	if (err) {
		return res.json(err[0])
	}
}

function convertPass(req, res, next) {
	return validation.convertPass(req.body.password).then((data) => {
		req.body.password = data
		next();
	});

}
function checkHotels(req, res, next) {
	let { cityCode, rooms, arrivalDate, leaveDate, nationality } = req.body;
	let error = [];
	if (!cityCode) {
		error.push({ code: 500, message: "city code is required." })
	}
	else if (!rooms) {
		error.push({ code: 500, message: "please check room data" })
	}
	else if (!arrivalDate) {
		error.push({ code: 500, message: "check in date is required." })
	}
	else if (!leaveDate) {
		error.push({ code: 500, message: "checkout date is required." })
	}
	else if (!nationality) {
		error.push({ code: 500, message: "nationality is required" })
	}

	if (error.length > 0) {
		errors(error, res);
	}
	else {
		next();
	}
}

function checkCarRental(req, res, next) {
	let { airport_code, start_date, end_date, filters } = req.body;

	let error = [];
	if (!airport_code) {
		error.push({ code: 500, message: "airport code is required." })
	}
	else if (!start_date) {
		error.push({ code: 500, message: "start date is required." })
	}
	else if (!end_date) {
		error.push({ code: 500, message: "end date is required." })
	}
	else if (!filters) {
		error.push({ code: 500, message: " filters is required." })
	}

	if (error.length > 0) {
		errors(error, res);
	}
	else {
		next();
	}
}

function checkFlights(req, res, next) {
	let { fromLocation, toLocation, departureDate, persons, userData } = req.body;
	let error = [];
	if (!fromLocation) {
		error.push({ code: 500, message: "source is required." })
	}
	else if (!toLocation) {
		error.push({ code: 500, message: "destination is required" })
	}
	else if (!departureDate) {
		error.push({ code: 500, message: "departure date is required." })
	}

	else if (!persons) {
		error.push({ code: 500, message: "persons is required" })
	}
	else if (!userData) {
		error.push({ code: 500, message: "user data is required" })
	}

	if (error.length > 0) {
		errors(error, res);
	}
	else {
		next();
	}
}






module.exports = {

	requiredCheck: register,
	convertPass: convertPass,
	checkLogin: checkLogin,
	checkUser: checkUser,
	checkFbLogin: checkFbLogin,
	makeRequestValid: makeRequestValid,
	checkHotels: checkHotels,
	checkCarRental: checkCarRental,
	checkFlights: checkFlights

}
