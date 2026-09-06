const jwt = require("jsonwebtoken");

const User = require("../models/users");



module.exports = async function(req,res,next){


try{


// Check Authorization header

const authHeader =
req.headers.authorization;



if(!authHeader){

return res.status(401).json({

error:"Authorization token required"

});

}




const token =
authHeader.split(" ")[1];



if(!token){

return res.status(401).json({

error:"Invalid authorization format"

});

}





// Verify JWT

const decoded =
jwt.verify(

token,

process.env.JWT_SECRET

);





// Find user

const user =
await User.findById(

decoded.id

);



if(!user){

return res.status(401).json({

error:"Account not found"

});

}





// Block banned accounts

if(user.banned === true){

return res.status(403).json({

error:"Account suspended"

});

}





// Update activity

user.lastLogin =
user.lastLogin || new Date();



await user.save();




// Attach user to request

req.user = user;



next();



}

catch(error){


console.log(
"AUTH ERROR:",
error.message
);



return res.status(401).json({

error:"Invalid or expired token"

});


}


};
