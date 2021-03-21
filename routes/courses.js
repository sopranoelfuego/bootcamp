
const express=require('express')
const {getCourses}=require('../controllers/courses.js')
const router=express.Router()


router.route('/')
      .get(getCourses)



module.exports=router