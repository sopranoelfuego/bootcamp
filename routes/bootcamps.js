const express=require('express')
const router=express.Router()

 const {getBootcamps,
    getBootcamp,
    updateBootcamp,
    deleteBootcamp,
    createBootcamp,
    deleteAllCamps
}=require('../controllers/bootcamps')


router.route('/')
    .get(getBootcamps)
    .post(createBootcamp)
    .delete(deleteAllCamps)
router.route('/:id')
     .get(getBootcamp)
     .put(updateBootcamp)
     .delete(deleteBootcamp)

module.exports =router