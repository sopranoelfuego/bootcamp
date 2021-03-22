
const express=require('express')
const ansyncHandler=require('../middleware/async.js')
const ErrorResponse=require('../utils/errorResponse.js')
const User=require('../models/User.js')
const {register}=require('../controllers/auth.js')

const router=express.Router()
router.route('/register').post(register)

module.exports=router