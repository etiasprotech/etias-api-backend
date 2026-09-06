const express = require("express");
const router = express.Router();

const User = require("../models/users");
const Payment = require("../models/payment");

const auth = require("../middleware/auth");

const emailService =
require("../services/emailService");




// ===============================
// ADMIN SECURITY
// ===============================


function adminOnly(req,res,next){


if(!req.user){

return res.status(401).json({

error:"Authentication required"

});

}



if(req.user.role !== "admin"){


return res.status(403).json({

error:"Admin access required"

});


}



next();


}









// ===============================
// ADMIN STATS
// ===============================


router.get(

"/stats",

auth,

adminOnly,

async(req,res)=>{


try{


const totalUsers =

await User.countDocuments({

role:{

$ne:"admin"

}

});





const activeUsers =

await User.countDocuments({

role:"user",

subscriptionStatus:"active"

});






const pendingPayments =

await Payment.countDocuments({

status:"pending"

});







const approvedPayments =

await Payment.countDocuments({

status:"approved"

});







const requests =

await User.aggregate([

{

$match:{

role:"user"

}

},


{

$group:{

_id:null,

total:{

$sum:"$totalRequests"

}

}

}


]);





res.json({

totalUsers,

activeUsers,

pendingPayments,

approvedPayments,

apiRequests:

requests[0]?.total || 0


});



}

catch(error){


res.status(500).json({

error:error.message

});


}


}

);









// ===============================
// GET USERS
// ===============================


router.get(

"/users",

auth,

adminOnly,

async(req,res)=>{


try{


const users =

await User.find({

role:{

$ne:"admin"

}

})

.select("-password")

.sort({

createdAt:-1

});





res.json({

users

});



}

catch(error){


res.status(500).json({

error:error.message

});


}



}

);









// ===============================
// CHANGE PLAN
// ===============================


router.put(

"/users/:id/plan",

auth,

adminOnly,

async(req,res)=>{


try{


const user =

await User.findById(

req.params.id

);





if(!user){

return res.status(404).json({

error:"User not found"

});

}




user.plan =

req.body.plan;



user.subscriptionStatus =

"active";




await user.save();





res.json({

success:true,

message:"Plan updated"

});



}

catch(error){


res.status(500).json({

error:error.message

});


}


}

);









// ===============================
// BAN USER
// ===============================


router.post(

"/users/:id/ban",

auth,

adminOnly,

async(req,res)=>{


const user =

await User.findById(

req.params.id

);



if(!user){

return res.status(404).json({

error:"User not found"

});

}



user.banned=true;


await user.save();



res.json({

success:true,

message:"User banned"

});



}

);









// ===============================
// UNBAN USER
// ===============================


router.post(

"/users/:id/unban",

auth,

adminOnly,

async(req,res)=>{


const user =

await User.findById(

req.params.id

);



user.banned=false;


await user.save();



res.json({

success:true,

message:"User unbanned"

});



}

);









// ===============================
// VIEW PAYMENTS
// ===============================


router.get(

"/payments",

auth,

adminOnly,

async(req,res)=>{


try{


const payments =

await Payment.find()

.populate(

"user",

"name email"

)

.sort({

createdAt:-1

});





res.json({

payments

});



}

catch(error){


res.status(500).json({

error:error.message

});


}



}

);









// ===============================
// APPROVE PAYMENT
// ===============================


router.post(

"/payments/:id/approve",

auth,

adminOnly,

async(req,res)=>{


try{


const payment =

await Payment.findById(

req.params.id

)

.populate("user");





if(!payment){

return res.status(404).json({

error:"Payment not found"

});

}





payment.status="approved";


await payment.save();





const user =

await User.findById(

payment.user._id

);





user.plan =

payment.plan;



user.subscriptionStatus =

"active";



user.lastPaymentStatus =

"approved";




await user.save();





if(emailService){

await emailService.paymentApproved(

user.email,

payment.plan

);

}





res.json({

success:true,

message:"Payment approved"

});



}

catch(error){


res.status(500).json({

error:error.message

});


}


}

);









// ===============================
// REJECT PAYMENT
// ===============================


router.post(

"/payments/:id/reject",

auth,

adminOnly,

async(req,res)=>{


try{


const payment =

await Payment.findById(

req.params.id

);



if(!payment){

return res.status(404).json({

error:"Payment not found"

});

}





payment.status="rejected";


payment.reason =

req.body.reason ||

"Rejected";



await payment.save();





res.json({

success:true,

message:"Payment rejected"

});



}

catch(error){


res.status(500).json({

error:error.message

});


}


}

);








module.exports = router;
