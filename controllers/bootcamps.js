const Bootcamp=require('../models/Bootcamp.js')
const mongoose=require('mongoose')
const ansyncHandler=require('../middleware/async.js')
const ErrorResponse=require('../utils/errorResponse.js')
// @desc get all bootcamps from database
// @route post api/v1/bootcamps
// @access public

const getBootcamps=ansyncHandler(async(req,res,next)=>{
    
    const allData=await Bootcamp.find()
    console.log(allData)
    if(allData.length > 0){
        res.status(200).json({success:"true",count:allData.length, data:allData})
      }else res.status(404).json({success:true,data:"there is not yet bootcamp"})

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
const deleteAllCamps=ansyncHandler(async(req,res,next)=>{


   const deleteOne= await Bootcamp.remove({})
    if(deleteOne){
        res.status(200).json({success:true,data:{message:"succeful deleted.."}})
    }
})
// @desc delete bootcamp
// @route delete api/v1/bootcamps:id
// @access private
module.exports={
    getBootcamps,
    getBootcamp,
    updateBootcamp,
    deleteBootcamp,
    createBootcamp,
    deleteAllCamps
}
