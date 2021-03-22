const ansyncHandler=require('../middleware/async.js')
const ErrorResponse=require('../utils/errorResponse.js')
const User=require('../models/User.js')

// @desc get all bootcamps from database
// @route GET api/v1/auth/register
// @access public


const register=ansyncHandler(async (req,res,next)=>{
   const  {name,email,password,role}=req.body
   

   await User.create({name,email,password,role})


    res.status(200).json({success:true})
})


module.exports={

    register
}