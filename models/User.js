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
    resetPassordTokenExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
    

})

// ENCRYPTION OF THE PASSWORD
userSchema.pre('save',async function () {
    
    const salt=await bcrypt.genSalt()
    this.password=await bcrypt.hash(this.password,salt)
})

// sign with jwtoken
userSchema.methods.getSignWithJsonWebToken=function(){
    
}




module.exports =mongoose.model('User',userSchema)