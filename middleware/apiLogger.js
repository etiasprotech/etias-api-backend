const ApiLog =
require("../models/apiLog");



module.exports = function(req,res,next){


const start =
Date.now();



res.on("finish",async()=>{


try{


if(req.apiUser){


await ApiLog.create({

user:req.apiUser._id,

endpoint:req.originalUrl,

method:req.method,

status:res.statusCode,

ip:req.ip,

responseTime:

Date.now()-start

});


}



}

catch(error){

console.log(
"API LOG ERROR:",
error.message
);

}


});



next();


};
