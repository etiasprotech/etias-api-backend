const mongoose = require("mongoose");


const PaymentSchema = new mongoose.Schema({

user:{

type:mongoose.Schema.Types.ObjectId,

ref:"User",

required:true

},


plan:{

type:String,

enum:[

"developer",

"pro",

"enterprise"

],

required:true

},


amount:{

type:Number,

required:true

},



paymentMethod:{

type:String,

default:"EcoCash"

},



ecocashNumber:{

type:String,

required:true

},



transactionId:{

type:String,

required:true,

unique:true

},



payerPhone:{

type:String,

required:true

},



proofImage:{

type:String,

required:true

},



status:{

type:String,

enum:[

"pending",

"approved",

"rejected"

],

default:"pending"

},



adminNote:{

type:String,

default:""

},



approvedAt:Date,


createdAt:{

type:Date,

default:Date.now

}



});



module.exports =
mongoose.model(

"Payment",

PaymentSchema

);
