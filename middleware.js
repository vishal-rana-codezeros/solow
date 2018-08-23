
const validation = require('./validations')

function register(req,res,next){

	let {fullname,username,email_id,password,fb_id,type} = req.body;
	let error = [];
	if(!fullname){
		error.push({code:500,message:"Full name is required."})
	}
	else if(!username){
		error.push({code:500,message:"User name is required."})
	}
	else if(!email_id){
		error.push({code:500,message:"Email is required."})
	}else if(!password){
		error.push({code:500,message:"Password is required."})
	}
	else if(!validation.validateEmail(email_id)){
		error.push({code:500,message:"Please provide valid email."})
	}
	else if(fb_id){
			error.push({code:500,message:"Fb id is not required."})
	}
	else if(type && type == 'facebook'){
	error.push({code:500,message:"Type needs to be normal."})
	}


	if(error.length >0){
		errors(error,res);
	}else
	next();


}

function checkLogin(req,res,next){
	let {username,password} = req.body;
	let error = [];
	if(!username){
		error.push({code:500,message:"Username is required."})
	}
	else if(!password){
		error.push({code:500,message:"Password is required."})
	}

	if(error.length >0){
		errors(error,res);
	}else
	next();
}

function checkUser(req,res,next){
	let {username} = req.query;
	let error = [];
	if(!username){
		error.push({code:500,message:"Username is required."})
	}

	if(error.length >0){
		errors(error,res);
	}else
	next();
}


function checkFbLogin(req,res,next){
	let {fb_id,type} = req.body;
	let error = [];

 if(!fb_id){
		error.push({code:500,message:"Facebook id is required."})
	}
	else if(!type || type != 'facebook') {
		error.push({code:500,message:"Provide a type."})
	}

	if(error.length >0){
		errors(error,res);
	}else
	next();

}



	function makeRequestValid(req,res,next){
			let error = [];
			let {source,destination,dateofdeparture,seatingclass,adults} = req.body;
			if(!source){
				error.push({code:400,message:"provide source."})
			}else if(!destination) {
				error.push({code:400,message:"provide destination."})
			}else if(!dateofdeparture) {
				error.push({code:400,message:"provide date of departure."})
			}else if(!seatingclass) {
				error.push({code:400,message:"provide seating class."})
			}
			else if(!adults) {
				error.push({code:400,message:"provide no of passengers."})
			}

			if(error.length >0){
				errors(error,res);
			}else
			next();
	}

function errors(err,res){
	if(err){
		return res.json(err[0])
	}
}



function convertPass(req,res,next){
	return validation.convertPass(req.body.password).then((data)=>{
		 req.body.password = data
		 next();
	});

}





module.exports = {

	requiredCheck :register,
	convertPass:convertPass,
	checkLogin:checkLogin,
	checkUser:checkUser,
	checkFbLogin:checkFbLogin,
	makeRequestValid:makeRequestValid


}
