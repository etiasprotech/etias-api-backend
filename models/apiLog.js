const mongoose = require("mongoose");


const ApiLogSchema = new mongoose.Schema({

user:{

type:mongoose.Schema.Types.ObjectId,

ref:"User",

required:true

},


endpoint:{

type:String,

required:true

},


method:{

type:String,

required:true

},


status:{

type:Number,

default:200

},


ip:{

type:String

},


responseTime:{

type:Number

},


createdAt:{

type:Date,

default:Date.now

}


});



module.exports =
mongoose.model(

"ApiLog",

ApiLogSchema

);
