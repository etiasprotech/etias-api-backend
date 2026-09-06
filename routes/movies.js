const router=require("express").Router();
const auth=require("../middleware/auth");
const axios=require("axios");
const apiLimiter=require("../middleware/apiLimiter");

router.get(
"/trending",
apiLimiter,
async(req,res)=>{

try{

const data=await axios.get(
"https://api.themoviedb.org/3/trending/movie/week",
{
params:{
api_key:process.env.MOVIE_API_KEY
}
});


res.json(data.data);

}catch(e){

res.status(500).json({
error:"Movie service failed"
});

}

});


router.get("/search",auth,async(req,res)=>{

const q=req.query.q;


const data=await axios.get(
"https://api.themoviedb.org/3/search/movie",
{
params:{
api_key:process.env.MOVIE_API_KEY,
query:q
}
});


res.json(data.data);

});


module.exports=router;
