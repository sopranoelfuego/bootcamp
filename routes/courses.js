
const express=require('express')
const {getCourses,createCourse,getCourse,updateCourse,deleteCourse,deleteAllCourses}=require('../controllers/courses.js')
const router=express.Router({mergeParams:true})
const Cours=require('../models/Course.js')
const advancedResult=require('../middleware/advancedResult.js')
const {protect,autorize}=require('../middleware/auth.js')

router.route('/')
      .get(advancedResult({
            path:'bootcamp',
            select:'name description'
        }),getCourses)
      
      .delete(protect,autorize('publisher','admin'),deleteAllCourses)
router.route('/:id')
      .get(getCourse)
      .put(protect,autorize('publisher','admin'),updateCourse)
      .delete(protect,autorize('publisher','admin'),deleteCourse)
      .post(protect,autorize('publisher','admin'),createCourse)


module.exports=router