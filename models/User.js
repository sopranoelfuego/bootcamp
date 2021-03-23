const crypto=require('crypto')
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please set name..']
    },
    email:{
        type:String,
        required:[true,'email please'],
        unique:true,
        match:[/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,'please enter a valid email'],


    },
    role:{
        type:String,
        enum:['user','publisher']
    },
    password:{
        type:String,
        required:[true,'password please'],
        minlength:6,
        select:false
    },
    resetPassordToken:String,
    resetPasswordExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
    

})

// ENCRYPTION OF THE PASSWORD
userSchema.pre('save',async function (next) {
    if(!this.isModified('password')){
      next()
          
    }
    const salt=await bcrypt.genSalt()
    this.password=await bcrypt.hash(this.password,salt)
})

// sign with jwtoken
userSchema.methods.getSignWithJsonWebToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })

   }
 userSchema.methods.matchPassword=async function(plainPassword){
    return await bcrypt.compare(plainPassword,this.password)
 }
//  generate and hash password

userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
  
    // Hash token and set to resetPasswordToken field
    this.resetPassordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };




module.exports =mongoose.model('User',userSchema)