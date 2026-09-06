const express = require("express");

const router = express.Router();


const multer = require("multer");

const path = require("path");


const auth = require("../middleware/auth");


const Payment =
require("../models/payment");





// ===============================
// FILE UPLOAD
// ===============================


const storage = multer.diskStorage({

destination:function(req,file,cb){

cb(null,"uploads/payments");

},


filename:function(req,file,cb){

const name =
Date.now()+"-"+file.originalname;


cb(null,name);

}


});



const upload =
multer({

storage,


limits:{

fileSize:5*1024*1024

}

});









// ===============================
// SUBMIT ECOCASH PAYMENT
// ===============================


router.post(

"/submit",

auth,

upload.single("proof"),

async(req,res)=>{


try{


const {

plan,

amount,

ecocashNumber,

transactionId,

payerPhone

}=req.body;




if(!req.file){

return res.status(400).json({

error:"Payment proof required"

});

}





const exists =

await Payment.findOne({

transactionId

});





if(exists){

return res.status(400).json({

error:"Transaction already submitted"

});

}







const payment =

await Payment.create({

user:req.user._id,

plan,

amount,

paymentMethod:"EcoCash",

ecocashNumber,

transactionId,

payerPhone,

proofImage:

"/uploads/payments/"+

req.file.filename

});






res.json({

success:true,

message:

"Payment submitted. Waiting for approval",

payment

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
// USER PAYMENT HISTORY
// ===============================


router.get(

"/history",

auth,

async(req,res)=>{


const payments =

await Payment.find({

user:req.user._id

})

.sort({

createdAt:-1

});



res.json({

payments

});


}

);








module.exports = router;
