const Bootcamp=require('../models/Bootcamp.js')
const mongoose=require('mongoose')
const ErrorResponse=require('../utils/errorResponse.js')
// @desc get all bootcamps from database
// @route post api/v1/bootcamps
// @access public

const getBootcamps=async(req,res,next)=>{
    try {
          const allData=await Bootcamp.find()
          if(allData.length === 0){
              res.status(200).json({success:"true",count:allData.length, data:allData})
            }
            next(new ErrorResponse(`sorry u commit a bad request`,404))
          
    } catch (error) {
        
        next(new ErrorResponse(`sorry u commit a bad request`,404))
    }
}

// @desc get single bootcamp from database
// @route get api/v1/bootcamps/:id
// @access public
const getBootcamp=async(req,res,next)=>{
    const {id:_id}=req.params
   try {
       if(mongoose.Types.ObjectId.isValid(_id)){
           
            const newBootcamp= await Bootcamp.findById({_id})
              res.status(200).json({success:true,data:newBootcamp})               
       }
          
        next(new ErrorResponse(` ${req.params.id} is a invalid id`,404 ))
        
        
    } catch (error) {

        next(new ErrorResponse(`sorry there is not bootcamp  with ${req.params.id}`,404 ))
       
   }
 }


// @desc create new bootcamp
// @route post api/v1/bootcamps
// @access private
    const createBootcamp=async(req,res,next)=>{
        try {
            const newBootcamp=await Bootcamp.create(req.body)
            
         res.status(201).json({success:"true",data:newBootcamp})
            
        } catch (error) {
            next(new ErrorResponse('sorry review your intries it seems u omit somthing',404 ))
            
        }
}


// @desc update bootcamp
// @route put api/v1/bootcamps:id
// @access private
const updateBootcamp=async(req,res,next)=>{
      
    try {
        const {id:_id}=req.params
       if(mongoose.Types.ObjectId.isValid(id)){

           const updatedBootcamp= await Bootcamp.findByIdAndUpdate({_id},req.body,{new:true,runValidators:true})
           res.status(200).json({success:true,data:updatedBootcamp})
       }else {

           next(new ErrorResponse(`sorry there be sure u enter the right id, (  ${req.params.id}) is invalid`,404))
       }
    } catch (error) {
        next(new ErrorResponse(`sorry there is not Bootcamp with such id (  ${req.params.id})`,404))
        
    }
}
const deleteBootcamp=async(req,res,next)=>{
    
    try {
        const {id:_id}=req.params
        const deletSuccess= await Bootcamp.findByIdAndDelete(_id)
        if(deletSuccess){

            res.status(200).json({success:true,data:{message:"success deleted.."}})
        }
         next(new ErrorResponse(`not bootcamp with id of ${req.parms.id}`,404))
    } catch (error) {
        next(new ErrorResponse(`not bootcamp with id of ${req.parms.id}`,404))
        
    }
    
}

// @desc delete bootcamp
// @route delete api/v1/bootcamps:id
// @access private
module.exports={
    getBootcamps,
    getBootcamp,
    updateBootcamp,
    deleteBootcamp,
    createBootcamp
}
