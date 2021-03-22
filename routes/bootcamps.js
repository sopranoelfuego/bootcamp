const express=require('express')
const router=express.Router({mergeParams:true})
const {createCourse}=require('../controllers/courses.js')
const Bootcamp=require('../models/Bootcamp.js')
const advancedResult=require('../middleware/advancedResult.js')
 const {getBootcamps,
    getBootcamp,
    updateBootcamp,
    deleteBootcamp,
    createBootcamp,
    deleteAllCamps,
    getBootcampRadius,
    bootcampUploadPhoto
}=require('../controllers/bootcamps')
const { route } = require('./courses.js')

// here we re-router to attached a course at each bootcamp
router.use('/:bootcampId/courses',createCourse)


router.route('/')
    .get(advancedResult(Bootcamp,'courses'), getBootcamps)
    .post(createBootcamp)
    .delete(deleteAllCamps)
router.route('/:id')
     .get(getBootcamp)
     .put(updateBootcamp)
     .delete(deleteBootcamp)
router.route('/radius/:zipCode/:distance')
     .post(getBootcampRadius)

router.route('/:id/photo')
     .put(bootcampUploadPhoto)
module.exports =router