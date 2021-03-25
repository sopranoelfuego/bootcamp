const crypto=require('crypto')
const ansyncHandler=require('../middleware/async.js')
const ErrorResponse=require('../utils/errorResponse.js')
const User=require('../models/User.js')

const sendEmail=require('../utils/sendEmail.js')
// @desc get all bootcamps from database
// @route post api/v1/auth/register
// @access public


const register=ansyncHandler(async (req,res,next)=>{
   const  {name,email,password,role}=req.body
   

  const user= await User.create({name,email,password,role})
// then  we generate a token to the specified user
   const token=await user.getSignWithJsonWebToken()
    res.status(200).json({success:true,token})
})


//   get token from model ,create cookie and send it response
const sendTokenToResponse=(user,statusCode,res)=>{

    const token=user.getSignWithJsonWebToken()
    const options={
        expires:new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly:true
    }
    if(process.env.NODE_ENV === 'production'){
        options.secure=true

    }
    res.status(statusCode).cookie('token',token,options).json({success:true,token})
 }


// @desc get all bootcamps from database
// @route post api/v1/auth/login
// @access public


const login=ansyncHandler(async (req,res,next)=>{
    const  {email,password}=req.body
    
   if(!email || !password){
      return next(new ErrorResponse('enter email and password',400))
    }
    //    1.check the user
    const user=await User.findOne({email}).select('+password')
    
    if(!user){
        return next(new ErrorResponse('invalid credentials',401))

    }
    // 2. chec if the password is matched
    const isMatch=await user.matchPassword(password)
    if(!isMatch){
        return next(new ErrorResponse('wrong password',401))
    }
    // then  we generate a token to the specified user
//    const token=await user.getSignWithJsonWebToken()
//    res.status(200).json({success:true,token})

    sendTokenToResponse(user,200,res)

 })
 // @desc get the login user
 // @route get api/v1/auth/me
 // @access private
 const getMe=ansyncHandler(async(req,res,next)=>{
     console.log("this is the user",req.user)
     
    //  remember here that req.user is a object {id} which means re
     const user=await User.findById(req.user.id)
    
     if(!user){
         return next(new ErrorResponse('user undefinied',404))
      }
      res.status(200).json({success:true,data:user})
}
)



// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
const updateDetails = ansyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };
  
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
  
    res.status(200).json({
      success: true,
      data: user,
    });
  });
  // @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
const updatePassword = ansyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
  
    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse('Password is incorrect', 401));
    }
  
    user.password = req.body.newPassword;
    await user.save();
  
    sendTokenToResponse(user, 200, res);

  });

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
const forgotPassword = ansyncHandler (async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorResponse('There is no user with that email', 404));
    }
  
    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });
  
    
    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/auth/resetpassword/${resetToken}`;
  
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
      });
  
      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.log(err);
      user.resetPassordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
  
      return next(new ErrorResponse('Email could not be sent', 500));
    }
  });


   
// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public

const resetPassword = ansyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPassordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');
  
    const user = await User.findOne({
        resetPassordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(new ErrorResponse('Invalid token', 400));
    }
  
    // Set new password
    user.password = req.body.password;
    user.resetPassordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
  
    sendTokenToResponse(user, 200, res);
  });
  



module.exports={

    register,
    login,
    getMe,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword
}
