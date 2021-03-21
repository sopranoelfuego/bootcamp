const Bootcamp=require('../models/Bootcamp.js')
const mongoose=require('mongoose')
const ansyncHandler=require('../middleware/async.js')
const ErrorResponse=require('../utils/errorResponse.js')

const geocoder = require('../utils/geocoder.js')
// @desc get all bootcamps from database
// @route post api/v1/bootcamps
// @access public

const getBootcamps=ansyncHandler(async(req,res,next)=>{
   let query
//    copy the request.query
    const cpQuery={...req.query}
    
    // @desc fields to remove
    const removeFields=['select']
    
    // @desc loop over  removFields and delete them from cpquery
    removeFields.forEach(match => delete cpQuery[match])
    console.log(cpQuery)
    
    // @desc we have to get back to the string format from json data query 
    let queryString=JSON.stringify(cpQuery)
    // @desc means that we attached a $ sign to the operator
    queryString=queryString.replace(/\b(gt|gte|lt|lte|in)\b/g,match => `$${match}`)
    /** */
    // @decr then get back to the json format and use it to query in database

    // @desc get the data from backend
    console.log("this is query in json",queryString)
    query=Bootcamp.find(JSON.parse(queryString))

//    if(req.query.select){
//     //    @desc as the syntax of select is the following // include a and b, exclude other fields
//     // query.select('a b');

//     // @descr find ressources
//         const allData=Bootcamp.find(JSON.parse(queryString))
    
//        console.log(req.query.select)
//        const fields=req.query.select.split(',').join(' ')
//        console.log(newQuery)
//        allData=allData.select(fields)

//    }
  //  @descr then we execute the query
  const execut=await query

  if(execut.length>0){
      res.status(200).json({success:true,count:execut.length,data:execut})
  }else res.status(404).json({success:false,err:"not Bootcamp founded"})




    


})

// @desc get single bootcamp from database
// @route get api/v1/bootcamps/:id
// @access public
const getBootcamp=ansyncHandler(async(req,res,next)=>{
    const {id:_id}=req.params
   
             const newBootcamp= await Bootcamp.findById({_id})
             if(newBootcamp){
               res.status(200).json({success:true,data:newBootcamp})               

           }
 
        

 }
)

// @desc create new bootcamp
// @route post api/v1/bootcamps
// @access private
    const createBootcamp=ansyncHandler(async(req,res,next)=>{
       
        const newBootcamp=await Bootcamp.create(req.body)
        
        if(newBootcamp)
        {
            res.status(201).json({success:"true",data:newBootcamp})
          }else next(new ErrorResponse('error bootcamp not created',400))
  
})


// @desc update bootcamp
// @route put api/v1/bootcamps:id
// @access private
const updateBootcamp=ansyncHandler(async(req,res,next)=>{
      
    
    const {id:_id}=req.params
   if(mongoose.Types.ObjectId.isValid(id)){

       const updatedBootcamp= await Bootcamp.findByIdAndUpdate({_id},req.body,{new:true,runValidators:true})
       res.status(200).json({success:true,data:updatedBootcamp})
   }else {
   return next(new ErrorResponse('id is not found in the comment',404))
   }

})
const deleteBootcamp=ansyncHandler(async(req,res,next)=>{
    const {id:_id}=req.params
    const deletSuccess= await Bootcamp.findByIdAndDelete(_id)
    if(deletSuccess){

        res.status(200).json({success:true,data:{message:"success deleted.."}})
    }
    res.status(404).json({success:false,err:""})
})
// @desc delete bootcamp
// @route delete api/v1/bootcamps:id
// @access private
const deleteAllCamps=ansyncHandler(async(req,res,next)=>{
   const deleteOne= await Bootcamp.remove({})
    if(deleteOne){
        res.status(200).json({success:true,data:{message:"succeful deleted.."}})
    }
})

// @desc GET bootcampRadius
// @route GET api/v1/bootcamps/radius/:zipCode/:distance
// @access private

const getBootcampRadius=ansyncHandler(async(req,res,next)=>{
   const {zipCode,distance}=req.params
//    @decr the duty here is to find the longitude and latitude coordinations

   const locat=await geocoder.geocode(zipCode)
  const longitude=locat[0].longitude
  const lagitude=locat[0].latitude
//   @radius equal to distance divide the radius of the earth
// which radous is 3,963 mi / 6,376 km then we calculate radius 
  const radius=distance/3963

  const bootCamps=await Bootcamp.find(
      {
          location: {$geoWithin: { $centerSphere: [ [ longitude, lagitude ], radius ] }}
      }
  )

   res.status(200).json({
       success:true,
       count:bootCamps.length,
       data:bootCamps
   })
})



module.exports={
    getBootcamps,
    getBootcamp,
    updateBootcamp,
    deleteBootcamp,
    createBootcamp,
    deleteAllCamps,
    getBootcampRadius
}
