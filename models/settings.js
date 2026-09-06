const mongoose=require("mongoose");


const SettingsSchema=new mongoose.Schema({

ecocashNumber:{
type:String,
default:"0771292748"
},


merchantName:{
type:String,
default:"ETIAS API HUB"
}

});


module.exports =
mongoose.model(
"Settings",
SettingsSchema
);
