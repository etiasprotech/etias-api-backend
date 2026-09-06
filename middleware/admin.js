module.exports = function(req,res,next){


// Check if logged in user is admin

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


};
