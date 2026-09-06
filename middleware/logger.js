const fs=require("fs");


module.exports=(req,res,next)=>{


const log = `

${new Date().toISOString()}

${req.method}

${req.originalUrl}

IP:
${req.ip}

USER:
${req.headers["x-api-key"] || "guest"}

---------------------

`;



fs.appendFile(

"api.log",

log,

(err)=>{

if(err)
console.log(err);

}

);



next();


};
