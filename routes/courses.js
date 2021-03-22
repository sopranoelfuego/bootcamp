
const express=require('express')
const {getCourses,createCourse,getCourse,updateCourse,deleteCourse,deleteAllCourses}=require('../controllers/courses.js')
const router=express.Router({mergeParams:true})
const Cours=require('../models/Course.js')
const advancedResult=require('../middleware/advancedResult.js')


router.route('/')
      .get(advancedResult({
            path:'bootcamp',
            select:'name description'
        }),getCourses)
      
      .delete(deleteAllCourses)
router.route('/:id')
      .get(getCourse)
      .put(updateCourse)
      .delete(deleteCourse)
      .post(createCourse)


module.exports=router