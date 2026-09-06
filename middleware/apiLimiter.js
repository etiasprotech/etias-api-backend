const User = require("../models/users");

const emailService = require("../services/emailService");

const limits = {

free:100,

developer:5000,

pro:50000,

enterprise:Infinity

};



module.exports = async function(req,res,next){


try{


const apiKey =

req.headers["x-api-key"];



if(!apiKey){

return res.status(401).json({

error:"API key required"

});

}




const user = await User.findOne({

apiKey

});




if(!user){

return res.status(401).json({

error:"Invalid API key"

});

}





// Check subscription

if(user.banned){

return res.status(403).json({

error:"Account banned"

});

}





const limit =

limits[user.plan] || 100;





// reset monthly usage

const now = new Date();



if(

!user.lastUsageReset ||

user.lastUsageReset.getMonth()

!==

now.getMonth()

){


user.monthlyRequests = 0;

user.lastUsageReset = now;


}





if(

user.monthlyRequests >= limit

&&

limit !== Infinity

){

await emailService.limitReached(
user.email
);


return res.status(403).json({

error:"Monthly API limit reached",

message:"Upgrade your plan to continue"

});

return res.status(403).json({

error:"Monthly API limit reached",

plan:user.plan,

limit

});


}






user.monthlyRequests += 1;
user.totalRequests += 1;


const today =
new Date()
.toISOString()
.split("T")[0];


let record =
user.usageHistory.find(
u=>u.date===today
);


if(record){

record.requests += 1;

}else{


user.usageHistory.push({

date:today,

requests:1

});


}


await user.save();





req.user = user;



next();





}catch(error){


res.status(500).json({

error:error.message

});


}



};
