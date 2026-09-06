const User = require("../models/users");


const limits = {

free:100,

developer:5000,

pro:50000,

enterprise:999999999


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





const user =

await User.findOne({

apiKey

});





if(!user){

return res.status(401).json({

error:"Invalid API key"

});

}





if(user.banned){

return res.status(403).json({

error:"Account suspended"

});

}






const limit =

limits[user.plan] || 100;



const used =

user.monthlyRequests || 0;





if(used >= limit){


return res.status(429).json({

error:"API limit reached",

message:"Upgrade your plan to continue",

plan:user.plan,

limit

});



}







// count request

user.monthlyRequests += 1;

user.totalRequests += 1;

user.lastRequest = new Date();





await user.save();





req.apiUser = user;



next();



}

catch(error){


res.status(500).json({

error:error.message

});


}


};
