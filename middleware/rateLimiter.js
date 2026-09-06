const rateLimit = require("express-rate-limit");


// General website/API protection

const generalLimiter =
rateLimit({

windowMs:
15 * 60 * 1000, // 15 minutes


max:
200,


message:{

error:
"Too many requests. Try again later."

},


standardHeaders:true,

legacyHeaders:false

});





// AI API stricter limit

const aiLimiter =
rateLimit({

windowMs:
60 * 60 * 1000,


max:
50,


message:{

error:
"AI request limit reached"

}

});





// Movie API limit

const movieLimiter =
rateLimit({

windowMs:
60 * 60 * 1000,


max:
500,


message:{

error:
"Movie API request limit reached"

}

});





module.exports={
generalLimiter,
aiLimiter,
movieLimiter
};
