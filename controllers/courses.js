const Bootcamp=require('../models/Bootcamp.js')
const mongoose=require('mongoose')
const Course=require('../models/Course.js')
const ansyncHandler=require('../middleware/async.js')
const ErrorResponse=require('../utils/errorResponse.js')


// @desc get all bootcamps from database
// @route post api/v1/bootcamps/:bootcampId/courses
// @access public

const getCourses=ansyncHandler(async(req,res,next)=>{
    let query;
    if(req.params.bootcampId){
        query=Course.find({bootcamp:req.params.bootcampId})
     }else{
         query=Course.find()
     }
     const courses=await query
     res.status(200).json({success:true,count:courses.length,data:courses})
})

module.exports={getCourses}