const bcrypt = require('bcryptjs');


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(email)){
    	return true
    }else
    return false
}


function convertPass(pass){
		return bcrypt.hash(pass,10);
}


var getRandomPassword = function (cb) {
    return cb(Math.floor((Math.random() * 1000000000000) + 1));
};



function mapLogin(data,cb){
	return cb({
		fullname : data.fullname,
		username: data.username,
		gender:data.gender,
		email_id:data.email_id,
		age:data.age,
		profession_id:data.profession_id,
		city_id:data.city_id,
		religion:data.religion,
		type:data.type,
		fb_id:data.fb_id,
		status:data.status
	})
}


module.exports = {
	validateEmail:validateEmail,
	convertPass:convertPass,
	mapLogin: mapLogin,
	getRandomPassword:getRandomPassword
}
