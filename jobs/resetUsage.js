const User =
require("../models/users");


async function resetUsage(){

await User.updateMany(

{},

{

monthlyRequests:0

}

);


console.log(
"API usage reset"
);


}



module.exports = resetUsage;
