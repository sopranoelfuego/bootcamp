const express=require('express')
const router=express.Router()

 const {getBootcamps,
    getBootcamp,
    updateBootcamp,
    deleteBootcamp,
    createBootcamp,
    deleteAllCamps,
    getBootcampRadius
}=require('../controllers/bootcamps')


router.route('/')
    .get(getBootcamps)
    .post(createBootcamp)
    .delete(deleteAllCamps)
router.route('/:id')
     .get(getBootcamp)
     .put(updateBootcamp)
     .delete(deleteBootcamp)
router.route('/radius/:zipCode/:distance')
     .post(getBootcampRadius)
module.exports =router