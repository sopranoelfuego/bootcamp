const Bootcamp=require('../models/Bootcamp.js')
const mongoose=require('mongoose')
// @desc get all bootcamps from database
// @route post api/v1/bootcamps
// @access public

const getBootcamps=async(req,res)=>{
    try {
          const allData=await Bootcamp.find()
          
          res.status(200).json({success:"true",count:allData.length, data:allData})
    } catch (error) {
        
        res.status(400).json({sucess:false,err:error})
    }
}

// @desc get single bootcamp from database
// @route get api/v1/bootcamps/:id
// @access public
const getBootcamp=async(req,res)=>{
    const {id:_id}=req.params
   try {
        

       
         await Bootcamp.findById({_id})
          res.status(200).json({success:true})
    //   if(mongoose.Types.ObjectId.isValid(_id)){

             
    //   }
   } catch (error) {
       res.status(400).json({success:false,err:error})
       
   }
 }


// @desc create new bootcamp
// @route post api/v1/bootcamps
// @access private
    const createBootcamp=async(req,res)=>{
        try {
            const newBootcamp=await Bootcamp.create(req.body)
            
         res.status(201).json({success:"true",data:newBootcamp})
            
        } catch (error) {
            res.status(404).json({sucess:'false',err:error.message})
            
        }
}


// @desc update bootcamp
// @route put api/v1/bootcamps:id
// @access private
const updateBootcamp=async(req,res)=>{
      
    try {
        const {id:_id}=req.params

        const updatedBootcamp= await Bootcamp.findByIdAndUpdate({_id},req.body,{new:true,runValidators:true})
        res.status(200).json({success:true,data:updatedBootcamp})
    } catch (error) {
        res.status(400).json({success:false,err:error})
        
    }
}
const deleteBootcamp=async(req,res)=>{
    
    try {
        const {id:_id}=req.params
        const deletSuccess= await Bootcamp.findByIdAndDelete(_id)
        if(deletSuccess){

            res.status(200).json({success:true,data:{message:"success deleted.."}})
        }else res.status(404).json({success:false,message:"no such document fund.."})
    } catch (error) {
        res.status(400).json({success:false,err:error})
        
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
