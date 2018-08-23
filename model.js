const mongoose = require('mongoose');
const schema  = mongoose.Schema;

const userSchema = new schema({
fullname:String,
username:String,
password:String,
email_id:String,
age:Number,
profession_id:String,
city_id:String,
religion:String,
gender:{type:String,enum:['Male','Female'],default:'Male'},
createdAt:{type:Date,default:Date.now},
type:{type:String,enum:['normal','facebook'],default:'normal'},
createdAt:{type:Date,default:Date.now},
fb_id:String,
status:{type:String,default:'ACTIVE'}
}) ;


module.exports = mongoose.model('user',userSchema);
