const transporter =
require("../config/email");



async function sendEmail(
to,
subject,
html
){

await transporter.sendMail({

from:
"ETIAS API HUB <your_email@gmail.com>",

to,

subject,

html

});


}



exports.paymentApproved =
async(email,plan)=>{


sendEmail(

email,

"ETIAS Payment Approved",

`

<h2>Payment Approved ✅</h2>

<p>Your ETIAS API HUB subscription is now active.</p>

<p>Plan: <b>${plan}</b></p>

<p>You can now access your API dashboard.</p>

`

);


};





exports.accountActivated =
async(email)=>{


sendEmail(

email,

"Account Activated",

`

<h2>Welcome to ETIAS API HUB 🚀</h2>

<p>Your developer account has been activated.</p>

`

);


};






exports.limitReached =
async(email)=>{


sendEmail(

email,

"API Limit Reached",

`

<h2>API Usage Limit Reached</h2>

<p>Your monthly API quota has been used.</p>

<p>Upgrade your plan to continue.</p>

`

);


};

exports.verifyEmail =
async(email,token)=>{


sendEmail(

email,

"Verify your ETIAS API HUB account",

`

<h2>Welcome to ETIAS API HUB 🚀</h2>

<p>
Click the link below to verify your email:
</p>

<a href="http://localhost:5500/verify.html?token=${token}">
Verify Account
</a>

`

);


};





exports.passwordReset =
async(email,token)=>{


sendEmail(

email,

"Reset your ETIAS password",

`

<h2>Password Reset</h2>

<p>
Click below to create a new password:
</p>

<a href="http://localhost:5500/reset-password.html?token=${token}">
Reset Password
</a>

`

);


};
