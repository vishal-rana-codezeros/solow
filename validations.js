const bcrypt = require('bcryptjs');


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(email)){
    	return true
    }else
    return false
}


async function convertPass(password){
	let en_pass = await bcrypt.hash(password,10)
	password = en_pass;
	console.log("after hash",password);
	return password
}


var getRandomPassword = function (cb) {
    return cb(Math.floor((Math.random() * 1000000000000) + 1));
};



function mapLogin(data,token,cb){
	
	return cb({
		fullname : data.fullname,
		email_id:data.email_id,
		// fb_id:data.fb_id,
		token:token
	})
}


module.exports = {
	validateEmail:validateEmail,
	convertPass:convertPass,
	mapLogin: mapLogin,
	getRandomPassword:getRandomPassword
}
