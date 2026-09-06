require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/users");


mongoose.connect(

process.env.MONGO_URI

)
.then(async()=>{


console.log("Database connected");



const exists =
await User.findOne({

email:"admin@etias.com"

});



if(exists){

console.log("Admin already exists");

process.exit();

}



const password =
await bcrypt.hash(

"Admin@12345",

12

);





await User.create({

name:"ETIAS Admin",

email:"admin@etias.com",

password,

role:"admin",

emailVerified:true,

plan:"enterprise",

subscriptionStatus:"active",

apiKey:"ETIAS-ADMIN"

});





console.log("Admin created");


console.log("Email: admin@etias.com");

console.log("Password: Admin@12345");



process.exit();



})

.catch(err=>{

console.log(err);

});
