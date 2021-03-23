const mongoose=require('mongoose')
const slug=require('slugify')

const geocoder=require('../utils/geocoder.js')

const Bootcamp=new mongoose.Schema({
     
    
    name: {
        type:String,
        required:[true,'please add name..'],
        unique:true,
        trim:true,
        maxlength: [50,'name must not exceed 50 characters'],
    },
    slug:String,
    description :{
        type:String,
        required:[true,'please add description..'],
        
        maxlength: [500,'description must not exceed 500 characters'],

    },
    website:{
        type:String,
        match:[/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,"please enter the correct website"]
    },
    phone:{
        type: String,
         required:[20,"phone number must not exceed 20 characters"]
    },
    email:{
        type:String,
        match:[/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,'please enter a valid email']

    },
    address :{
        type:String,
        required:[true,'please enter the address']
    },
    location: {
        // @descri this is geoJson 
         type:{ 
         type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
        //   required: true
        },
        coordinates: {
          type: [Number],
        //   required: true,
          index:"2dsphere"
        },
      
      formattedAddress:String,
      street:String,
      city:String,
      state:String,
      zipcode:String,
      country:String,
    },
      careers:{
          type:[String],
          required:true,
          enum:[
              'Web Development',
               'Mobile Developement',
               'UI/UX',
               'Data Science',
               'Business',
               'Others'

            
            ]
           
      },
      averageRating:{
          type:Number,
          min:[1,'rating must be at least 1'],
          max:[10,'rating must not exceed 10']

      },
      averageCost:Number,
      photo :{
          type:String,
          default:'no-photo.png'
      },
      housing:{
          type:Boolean,
          default:false
      },
      jobAssistance:{
          type:Boolean,
          default:false
      },
      jobGuarantee:{
          type:Boolean,
          default:false
      },
      acceptGi:{
          type:Boolean,
          default:false
      },
      createdAt:{
          type:Date,
          default:Date.now
      },
      user :{
          type:mongoose.Schema.ObjectId,
          ref:'User',
          required:true

      }
    

},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
// @decr this methode will update the slug witch is the acronym of the bootcamp name
Bootcamp.pre('save',function(next){
    this.slug=slug(this.name,{lower:true})
    next()
})
Bootcamp.pre('save',async function (next){
    let locat= await geocoder.geocode(this.address)
    this.location={
        type:'Point',
        coordinates:[locat[0].longitude,locat[0].latitude],
        formattedAddress:locat[0].formattedAddress,
        street:locat[0].streetName,
        city:locat[0].city,
        state:locat[0].state,
        zipcode:locat[0].zipcode,
        country:locat[0].countryCode,
    }
    // @desc as we have the full address info we can ommit to save the address data field 
    this.address=undefined

    next()
})

// @desc reverse the populate which will populate all the data from courses
// where there is bootcamp in course
Bootcamp.virtual('courses',{
    ref:'Course',
    localField:"_id",
    foreignField:'bootcamp',
    justOne:false
})
// @descr HERE WE SPECIFY THAT IF THE BOOTCAMP IS REMOVED THEN IS SUITABL WITH IT COURSES CORRESPONDANCES
Bootcamp.pre('remove',async function(next) {

    await this.model('Course').deleteMany({bootcamp:this._id})
    next()
    
})

module.exports =mongoose.model('Bootcamp',Bootcamp)