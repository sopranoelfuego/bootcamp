
const express=require('express')
const ansyncHandler=require('../middleware/async.js')
const ErrorResponse=require('../utils/errorResponse.js')
const User=require('../models/User.js')
const {register,login,getMe,forgotPassword,resetPassword,updateDetails,updatePassword}=require('../controllers/auth.js')
const {protect}=require('../middleware/auth.js')
const router=express.Router()
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/me').get(protect,getMe)
router.route('/updatedetails').post(protect,updateDetails)
router.route('/forgotpassword').post(forgotPassword)
router.route('/updatepassword').post(protect,updatePassword)
router.route('/resetpassword/:resettoken').post(resetPassword)


module.exports=router