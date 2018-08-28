const express    = require('express');
const app    = express();
const mongoose   = require('mongoose');
const config   = require('./config');
const bodyParser  = require('body-parser');
const middleWare = require('./middleware')


const userAction   = require('./user_actions');
app.set('port',process.env.PORT || 8090);


mongoose.connect(config.path);

app.use(express.static(__dirname+'/public'))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.post('/register',[middleWare.requiredCheck,middleWare.convertPass],(req,res)=>userAction.createUser(req,res))

app.post('/login',[middleWare.checkLogin],(req,res)=>userAction.checkLogin(req,res))

app.post('/forgot_password',(req,res)=>userAction.forgot_password(req,res))

app.get('/checkUser',[middleWare.checkUser],(req,res)=>userAction.checkUser(req,res))

app.post('/loginFacebook',[middleWare.checkFbLogin],(req,res)=>userAction.loginFb(req,res));

app.get('/checkHotel',(req,res)=>userAction.getAvailableHotels(req,res));

//search flight
app.post('/checkFlight',[middleWare.makeRequestValid],(req,res)=>userAction.checkflights(req,res));

// app.get('/checkCarRent',(req,res)=>userAction.checkCarRental(req,res))

app.getAllFlights('/getAllFlights',())

app.listen(app.get('port'),()=>{
console.log(`Server listening on ${app.get('port')}`);
})
