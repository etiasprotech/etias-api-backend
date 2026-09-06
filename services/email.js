const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({

service:"gmail",

auth:{
user:process.env.EMAIL_USER,
pass:process.env.EMAIL_PASSWORD
}

});



async function sendEmail(to, subject, message){

await transporter.sendMail({

from:
`ETIAS API HUB <${process.env.EMAIL_USER}>`,

to,

subject,

html:message

});

}



module.exports = sendEmail;
