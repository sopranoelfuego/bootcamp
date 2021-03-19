const mongoose=require('mongoose')



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
        }
      },
      formattedAddres:String,
      street:String,
      city:String,
      state:String,
      zipcode:String,
      country:String,
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
      }

})


module.exports =mongoose.model('Bootcamp',Bootcamp)