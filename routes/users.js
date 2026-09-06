const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/users");

const auth = require("../middleware/auth");

const emailService = require("../services/emailService");



// ===============================
// REGISTER
// ===============================

router.post("/register", async(req,res)=>{

try{


const {
name,
email,
password
}=req.body;



if(!name || !email || !password){

return res.status(400).json({

error:"All fields required"

});

}



const exists =
await User.findOne({

email

});



if(exists){

return res.status(400).json({

error:"Email already exists"

});

}





const hashedPassword =
await bcrypt.hash(

password,

12

);





const apiKey =
"ETIAS-" +

crypto.randomBytes(6)
.toString("hex")
.toUpperCase();





const verifyToken =
crypto.randomBytes(32)
.toString("hex");





const user =
await User.create({

name,

email,

password:hashedPassword,

apiKey,

verificationToken:verifyToken,

emailVerified:false,

role:"user",

plan:"free",

subscriptionStatus:"inactive"

});





// Optional email verification

if(emailService){

await emailService.verifyEmail(

email,

verifyToken

);

}





const token =
jwt.sign(

{

id:user._id

},

process.env.JWT_SECRET,

{

expiresIn:"7d"

}

);





res.json({

success:true,

message:"Account created",

token,

user:{

id:user._id,

name:user.name,

email:user.email,

plan:user.plan,

role:user.role

},

apiKey:user.apiKey

});




}

catch(error){

res.status(500).json({

error:error.message

});

}


});









// ===============================
// LOGIN
// ===============================


router.post("/login", async(req,res)=>{


try{


const {
email,
password
}=req.body;



const user =
await User.findOne({

email

});



if(!user){

return res.status(401).json({

error:"Invalid email or password"

});

}





if(user.banned){

return res.status(403).json({

error:"Account suspended"

});

}





const valid =
await bcrypt.compare(

password,

user.password

);





if(!valid){

return res.status(401).json({

error:"Invalid email or password"

});

}





user.lastLogin =
new Date();



await user.save();





const token =
jwt.sign(

{

id:user._id

},

process.env.JWT_SECRET,

{

expiresIn:"7d"

}

);





res.json({

success:true,

token,

user:{

id:user._id,

name:user.name,

email:user.email,

plan:user.plan,

role:user.role

},

apiKey:user.apiKey

});



}

catch(error){

res.status(500).json({

error:error.message

});

}


});









// ===============================
// VERIFY EMAIL
// ===============================


router.get(

"/verify/:token",

async(req,res)=>{


try{


const user =
await User.findOne({

verificationToken:req.params.token

});



if(!user){

return res.status(400).json({

error:"Invalid verification token"

});

}



user.emailVerified=true;

user.verificationToken=null;


await user.save();



res.json({

success:true,

message:"Email verified"

});



}

catch(error){

res.status(500).json({

error:error.message

});

}


});









// ===============================
// GET PROFILE
// ===============================


router.get(

"/profile",

auth,

async(req,res)=>{


res.json({

user:req.user

});


});









// ===============================
// UPDATE PROFILE
// ===============================


router.put(

"/profile",

auth,

async(req,res)=>{


try{


const user=req.user;



if(req.body.name){

user.name=req.body.name;

}



await user.save();



res.json({

success:true,

message:"Profile updated",

user

});



}

catch(error){

res.status(500).json({

error:error.message

});

}


});









// ===============================
// REGENERATE API KEY
// ===============================


router.post(

"/regenerate-key",

auth,

async(req,res)=>{


try{


const newKey =

"ETIAS-" +

crypto.randomBytes(6)

.toString("hex")

.toUpperCase();





req.user.apiKey =
newKey;



await req.user.save();





res.json({

success:true,

apiKey:newKey

});



}

catch(error){

res.status(500).json({

error:error.message

});

}


});









// ===============================
// CHANGE PASSWORD
// ===============================


router.post(

"/change-password",

auth,

async(req,res)=>{


try{


if(!req.body.password){

return res.status(400).json({

error:"Password required"

});

}




req.user.password =

await bcrypt.hash(

req.body.password,

12

);




await req.user.save();




res.json({

success:true,

message:"Password changed"

});



}

catch(error){

res.status(500).json({

error:error.message

});

}


});









// ===============================
// DELETE ACCOUNT
// ===============================


router.delete(

"/delete",

auth,

async(req,res)=>{


try{


await User.findByIdAndDelete(

req.user._id

);



res.json({

success:true,

message:"Account deleted"

});



}

catch(error){

res.status(500).json({

error:error.message

});

}


});









// ===============================
// API USAGE ANALYTICS
// ===============================


router.get(

"/analytics",

auth,

async(req,res)=>{


const limits={


free:100,


developer:5000,


pro:50000,


enterprise:999999999


};





const limit =
limits[req.user.plan] || 100;



const used =
req.user.monthlyRequests || 0;





res.json({

plan:req.user.plan,

used,

limit,

remaining:

Math.max(

limit-used,

0

),


percentage:

Math.round(

(used / limit) * 100

),


history:

req.user.usageHistory || []

});



});









// ===============================
// FORGOT PASSWORD
// ===============================


router.post(

"/forgot-password",

async(req,res)=>{


try{


const user =
await User.findOne({

email:req.body.email

});



if(user){


const token =
crypto.randomBytes(32)
.toString("hex");



user.resetPasswordToken =
token;



user.resetPasswordExpires =
Date.now()+3600000;



await user.save();



if(emailService){

await emailService.passwordReset(

user.email,

token

);

}


}



res.json({

message:"If account exists, reset email sent"

});



}

catch(error){

res.status(500).json({

error:error.message

});

}


});









// ===============================
// RESET PASSWORD
// ===============================


router.post(

"/reset-password/:token",

async(req,res)=>{


try{


const user =
await User.findOne({

resetPasswordToken:req.params.token,

resetPasswordExpires:{

$gt:Date.now()

}

});



if(!user){

return res.status(400).json({

error:"Invalid or expired token"

});

}





user.password =

await bcrypt.hash(

req.body.password,

12

);



user.resetPasswordToken=null;

user.resetPasswordExpires=null;



await user.save();





res.json({

success:true,

message:"Password reset successful"

});



}

catch(error){

res.status(500).json({

error:error.message

});

}


});






module.exports = router;
