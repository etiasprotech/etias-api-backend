require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/users");





async function createAdmin(){


try{


await mongoose.connect(

process.env.MONGO_URI

);



console.log(
"MongoDB Connected"
);





// Prevent multiple admins

const existingAdmin =
await User.findOne({

role:"admin"

});




if(existingAdmin){


console.log(

"Admin account already exists"

);


process.exit(0);


}







const password =
await bcrypt.hash(

"tate98@@",

12

);







const admin =
await User.create({

name:

"ETIAS Administrator",



email:

"lyvonnempofu@gmail.com",



password,



role:

"admin",



apiKey:

"ETIAS-ADMIN",



emailVerified:

true,



plan:

"enterprise",



subscriptionStatus:

"active",



banned:

false


});







console.log(

"========================"

);


console.log(

"ADMIN CREATED"

);


console.log(

"ID:",
admin._id

);


console.log(

"EMAIL: ${email}"

);


console.log(

"PASSWORD: ${password}"

);


console.log(

"========================"

);




process.exit(0);



}

catch(error){



console.log(

"ADMIN CREATION ERROR:",

error.message

);


process.exit(1);



}


}





createAdmin();
