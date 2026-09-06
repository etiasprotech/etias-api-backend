const express = require("express");

const router = express.Router();


const auth =
require("../middleware/auth");


const ApiLog =
require("../models/apiLog");





router.get(

"/",

auth,

async(req,res)=>{


try{


const logs =

await ApiLog.find({

user:req.user._id

})

.sort({

createdAt:-1

})

.limit(50);





res.json({

logs

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
