const Bootcamp=require('../models/Bootcamp.js')
const mongoose=require('mongoose')
const ansyncHandler=require('../middleware/async.js')
const ErrorResponse=require('../utils/errorResponse.js')

const path=require('path')
const geocoder = require('../utils/geocoder.js')
// @desc get all bootcamps from database
// @route post api/v1/bootcamps
// @access public

const getBootcamps=ansyncHandler(async(req,res,next)=>{
    res.status(200).json(res.advancedResults)

})

// @desc get single bootcamp from database
// @route get api/v1/bootcamps/:id
// @access public
const getBootcamp=ansyncHandler(async(req,res,next)=>{
   
             const newBootcamp= await Bootcamp.findById(req.params.id)
             if(!newBootcamp){
                 return next(new ErrorResponse('not bootcamp with such id',404))
                }
                res.status(200).json({
                    success:true,
                    data:newBootcamp
                })
                
                
                
            }
            )
            
            // @desc create new bootcamp
            // @route post api/v1/bootcamps
// @access private
const createBootcamp=ansyncHandler(async(req,res,next)=>{
    //    as we pass through protect to initiate the req.user then we can get the user
    req.body.user=req.user.id
    // check for the publishedBootcamp 
    const publishedBootcamp=await Bootcamp.findOne({user:req.user.id})
    //   we have to be sure that users without role admin should add one bootcamp
    
    if(publishedBootcamp && req.user.role != 'admin'){
        
        return next(new ErrorResponse(`USER WITH ID ${req.user.id} has already published`,400))
        
    }
    const newBootcamp=await Bootcamp.create(req.body)
        
        if(!newBootcamp)
        {
            return  next(new ErrorResponse('error bootcamp not created',400))
        }
        
        res.status(201).json({success:"true",data:newBootcamp})
})


// @desc update bootcamp
// @route put api/v1/bootcamps:id
// @access private
const updateBootcamp=ansyncHandler(async(req,res,next)=>{
      
    
    const {id:_id}=req.params
   if(mongoose.Types.ObjectId.isValid(id)){

            let updatedBootcamp= await Bootcamp.findById(req.params.id)
            
            if(!updatedBootcamp){

                return next(new ErrorResponse('bootcamp not found ..',404))
            }

            //   make sure the one who want to update it is the owner
            if(updatedBootcamp.user.toString() !== req.user.id && req.user.role!=='admin'){
                
                return next(new ErrorResponse('IT SHOULD BE UPDATED BY THE OWNER',401))
            }
             updatedBootcamp= await Bootcamp.findByIdAndUpdate({_id},req.body,{new:true,runValidators:true})
      
            res.status(200).json({success:true,data:updatedBootcamp})
   }else {
       return next(new ErrorResponse('id is not valid',404))
   }

})
const deleteBootcamp=ansyncHandler(async(req,res,next)=>{
    
    let deletSuccess= await Bootcamp.findById(req.params.id)
    
    if(!deletSuccess){
        return next(new ErrorResponse('id not found ',404))
    }
    // check if is the owner of the bootcamp
    if(deletSuccess.user.toString() !== req.user.id && req.user.role!=='admin'){
                
        return next(new ErrorResponse('IT SHOULD BE DELETEED BY THE OWNER',401))
    }

    deletSuccess.remove()
    res.status(200).json({success:true,data:{message:"success deleted.."}})

})
// @desc delete bootcamp
// @route delete api/v1/bootcamps:id
// @access private
const deleteAllCamps=ansyncHandler(async(req,res,next)=>{

    //   check if is the owner
    if( req.user.role != 'admin'){
        
        return next(new ErrorResponse(`USER WITH ID ${req.user.id} IS NOT AUTORIZED`,400))
        
    }
    
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

// upload photo
const bootcampUploadPhoto=ansyncHandler(async(req,res,next)=>{
  
  const bootcamp=await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
        return next(new ErrorResponse('id is not found in the comment',404))
    }
    if(!req.files){
        return next(new ErrorResponse('please choose file',400))
        
    }
    //   check if is the owner
    if(bootcamp.user.id.toString !==req.user.id || req.user.role != 'admin'){
        
        return next(new ErrorResponse(`USER WITH ID ${req.user.id} IS NOT AUTORIZED`,400))
        
    }
   
    //  then we make sure if the file bring is a photo 
    let file=req.files.file
    if(!file.mimetype.startsWith('image')){
       return next(new ErrorResponse('please choose photo',400))
    }
    if (file.size > process.env.MAX_FILE_UPLOAD) {
       return next(new ErrorResponse(`please choose a photo which not exceed ${process.env.MAX_FILE_UPLOAD}`,400))
       }
    // create filename
    file.name=`photo_${bootcamp._id}${path.parse(file.name).ext}`
    console.log("this is file name".cyan.inverse,file.name)
    
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async(err)=>{
        if(err){
            console.log("the erro fom mv".red.inverse,err)
            return next(new ErrorResponse('problem with the file uploaded',500))
        }

    })
    // then we update the photo field
    await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name})
    res.status(200).json({
        success:true,data:file.name
    })
}) 

module.exports={
    getBootcamps,
    bootcampUploadPhoto,
    getBootcamp,
    updateBootcamp,
    deleteBootcamp,
    createBootcamp,
    deleteAllCamps,
    getBootcampRadius
}
 