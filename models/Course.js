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
    },
    user :{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true

    }

})

// static to get the averageCost of the course

courseSchema.statics.getAverageCost=async function(bootcampId) {
   console.log("calculat avg cost ...".blue)
   const obj=await this.aggregate([
       {
           $match:{bootcamp:bootcampId}
       },
       {
           $group:{
               _id:'$bootcamp',
               averageCost:{$avg:'$tuition'}
           }
       }
   ])

    console.log(obj)
    try {
         await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
             averageCost:Math.ceil(obj[0].averageCost/10) * 10
         })
    } catch (error) {
        console.error(error)
    }
}


// THIS METHODE CALL THE AVERAGECOST AFTER SAVE
courseSchema.post('save',function() {
    
    this.constructor.getAverageCost(this.bootcamp)
})



// THIS METHODE CALL THE AVERAGECOST BEFORE SAVE

courseSchema.pre('remove',function() {
    
    this.constructor.getAverageCost(this.bootcamp)
})



module.exports = mongoose.model('Course',courseSchema)