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
const {protect,autorize}=require('../middleware/auth.js')
const { route } = require('./courses.js')

// here we re-router to attached a course at each bootcamp
router.use('/:bootcampId/courses',createCourse)


router.route('/')
    .get(advancedResult(Bootcamp,'courses'), getBootcamps)
    .post(protect,autorize('publisher','admin'),createBootcamp)
    .delete(protect,autorize('publisher','admin'),deleteAllCamps)
router.route('/:id')
     .get(getBootcamp)
     .put(protect,autorize('publisher','admin'),updateBootcamp)
     .delete(protect,autorize('publisher','admin'),deleteBootcamp)
router.route('/radius/:zipCode/:distance')
     .post(getBootcampRadius)

router.route('/:id/photo')
     .put(protect,autorize('publisher','admin'), bootcampUploadPhoto)
module.exports =router