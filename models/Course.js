const mongoose=require('mongoose')

const courseSchema=new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        require:[true,"sorry title is required"],
    },
    description:{
        type:String,
        required:[true,"sorry add description"]
    },
    weeks:{
        type:String,
        required:[true,"add a mount of weeks which this course gonna takes"]
    },
    
    
    tuition:{
        type:Number,
        required:[true,"add tuition cost please..."]
    },
    minimumSkills:{
        type:String,
        required:[true,"please add minimum skills"],
        enum:['beginer','intermediate','advanced']
    },
    
    scholarshipAvailable:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
         ref:'Bootcamp',
         required:true
    }
})

module.exports = mongoose.model('Course',courseSchema)