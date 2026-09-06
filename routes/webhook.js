const router=require("express").Router();

const stripe=require("../config/stripe");

const User=require("../models/users");


router.post(
"/stripe",
async(req,res)=>{


const event=req.body;



if(event.type==="checkout.session.completed"){


const session =
event.data.object;


const user =
await User.findById(
session.metadata.userId
);



if(user){


user.plan =
session.metadata.plan;


user.subscriptionStatus =
"active";


user.stripeSubscriptionId =
session.subscription;


await user.save();


}


}



res.json({
received:true
});


});



module.exports=router;
