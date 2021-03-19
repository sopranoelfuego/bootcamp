


const ErrorResponse=require('../utils/errorResponse.js')

const errorHandler=(err,req,res,next)=>{
    let error={...err}
    error.message=err.message
    console.log(err.name,err.value)
    // case of bad objectId
    if(err.name === Error){
      let message=`Ressources not found with ${err.value} `   
    }
    res.status(err.statusCode || 500).json({success:false,err:err.message || 'server error...'})
    
}
module.exports =errorHandler