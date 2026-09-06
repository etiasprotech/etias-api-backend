const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema(

{

name:{

type:String,

required:true,

trim:true

},



email:{

type:String,

required:true,

unique:true,

lowercase:true,

trim:true

},



password:{

type:String,

required:true

},



// API access key

apiKey:{

type:String,

unique:true,

sparse:true

},



// user or admin

role:{

type:String,

enum:[

"user",

"admin"

],

default:"user"

},



// Account verification

emailVerified:{

type:Boolean,

default:false

},


verificationToken:{

type:String,

default:null

},



// Password reset

resetPasswordToken:{

type:String,

default:null

},


resetPasswordExpires:{

type:Date,

default:null

},



// Subscription

plan:{

type:String,

enum:[

"free",

"developer",

"pro",

"enterprise"

],

default:"free"

},



subscriptionStatus:{

type:String,

enum:[

"active",

"inactive",

"pending",

"cancelled"

],

default:"inactive"

},



// Payment tracking

lastPaymentStatus:{

type:String,

default:"none"

},



// Account control

banned:{

type:Boolean,

default:false

},



// API usage

monthlyRequests:{

type:Number,

default:0

},



totalRequests:{

type:Number,

default:0

},



usageHistory:[

{

date:{

type:String

},


requests:{

type:Number,

default:0

}

}

],



// Last activity

lastLogin:{

type:Date

},



lastRequest:{

type:Date

}



},

{

timestamps:true

}



);




// Prevent returning passwords accidentally

UserSchema.methods.toJSON = function(){

const user = this.toObject();


delete user.password;


return user;

};





module.exports =
mongoose.model(

"User",

UserSchema

);
