const mongoose = require('mongoose');
const schema  = mongoose.Schema;

const userSchema = new schema({
fullname:{type:String,required:true},
password:{type:String,required:function(){
  if(this.isSocialLogin)
    return false;
  else return true;
}
},
email_id:String,
country:String,
gender:{type:String,enum:['Male','Female'],default:'Male'},
createdAt:{type:Date,default:Date.now},
type:{type:String,enum:['normal','facebook'],default:function(){
  if(this.isSocialLogin){
    return 'facebook'
  }else return 'normal'
}},
createdAt:{type:Date,default:Date.now},
fb_id:{type:String,required:function(){
  if(this.isSocialLogin)
    return true;
  else return false;
}},
isSocialLogin:{type:Boolean},
status:{type:String,default:'ACTIVE'},
notify_flag:[{
  order_number:String,
  price_decrease:{type:Number,default:0},
  price_increase:{type:Number,default:0},
  price_dec_by:{
    status:{type:Number,default:0},
    price:Number
  },
  rooms_limited:{type:Number,default:0},
  seats_limited:{type:Number,default:0},
  buy_auto_price:{
    status:{type:Number,default:0},
    price:Number
  }
}]
}) ;


module.exports = mongoose.model('user',userSchema);
