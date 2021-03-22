const Bootcamp=require('../models/Bootcamp.js')
const mongoose=require('mongoose')
const Course=require('../models/Course.js')
const ansyncHandler=require('../middleware/async.js')
const ErrorResponse=require('../utils/errorResponse.js')

const { findById, listenerCount } = require('../models/Bootcamp.js')


// @desc get all bootcamps from database
// @route get api/v1/bootcamps/:bootcampId/courses
// @access public

const getCourses=ansyncHandler(async(req,res,next)=>{
   
    if(req.params.bootcampId){
        const courses=Course.find({bootcamp:req.params.bootcampId})
        res.status(200).json({
            succes:true,
            count:courses.length,
            data:courses
        })
     }else{

         res.status(200).json(res.advancedResults)
     }
})
// @desc add course
// @route post api/v1/courses/"id"
// @access private
const createCourse=ansyncHandler(async(req,res,next)=>{
     req.body.bootcamp=req.params.bootcampId
     const bootcamp=await Bootcamp.findById(req.params.bootcampId)
     
     if(!bootcamp){
         return next(new ErrorResponse(`there is not bootcamp with such id:${req.params.bootcampId}`,404))

     }
     const course=await Course.create(req.body)
     res.status(200).json({success:true,data:course})
})  
// @desc add course
// @route post api/v1/bootcamps/:bootcampId/courses
// @access public
const getCourse=ansyncHandler(async(req,res,next)=>{
      const course=await Course.findById(req.params.id).populate({
          path:'bootcamp',
         select:'name description', 
      })
      if(!course){
          console.log("this is single course",course)
        return next(new ErrorResponse("id is not found",404))
      }
      res.status(200).json({success:true,data:course})

})

// @desc add course
// @route PUT api/v1/courses/:id
// @access private

const updateCourse=ansyncHandler(async (req,res,next)=>{
  
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return next(new ErrorResponse('invalid id',404))
    }
   let course=await Course.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

    if(!course){
        return next(new ErrorResponse('course not found ',404))
    }

    res.status(200).json({success:true,data:course})

    



})

// @access private
// @route DELETE api/v1/courses/:id
// @access private
const deleteCourse=ansyncHandler(async (req,res,next)=>{
  
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return next(new ErrorResponse('invalid id',404))
    }


    let course=await Course.findById(req.params.id)
    if(!course){
        return next(new ErrorResponse('course not found ',404))
    }
   await course.remove()
    res.status(200).json({success:true,message:"succefful deleted.."})

    



})

const deleteAllCourses=ansyncHandler(async(req,res,next)=>{

      await Course.deleteMany()
      res.status(200).json({success:true,message:"succefully deleted"})
})


module.exports={getCourses,createCourse,getCourse,updateCourse,deleteCourse,deleteAllCourses}