const router = require("express").Router();

const authJWT = require("../middleware/auth");
const User = require("../models/users");


// ===============================
// GET CURRENT SUBSCRIPTION
// ===============================

router.get(
"/status",
authJWT,
async(req,res)=>{

const user =
await User.findById(req.user.id)
.select(
"plan subscriptionStatus subscriptionStart"
);


res.json({

subscription:user

});


});



// ===============================
// CANCEL SUBSCRIPTION
// (Manual cancellation)
// ===============================

router.post(
"/cancel",
authJWT,
async(req,res)=>{


const user =
await User.findById(
req.user.id
);



user.subscriptionStatus =
"cancelled";


await user.save();



res.json({

message:
"Subscription cancelled"

});


});



module.exports = router;
