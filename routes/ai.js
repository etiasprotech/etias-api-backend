const router=require("express").Router();
const auth=require("../middleware/auth");
const apiLimiter =
require("../middleware/apiLimiter");

router.post(
"/chat",
apiLimiter,
async(req,res)=>{


const message=req.body.message;


res.json({

reply:
`ETIAS AI received: ${message}`

});


});


module.exports=router;
