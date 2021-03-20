


const ErrorResponse=require('../utils/errorResponse.js')

const errorHandler=(err,req,res,next)=>{
    console.log(err.message.red)
    res.status(404).json({success:false,err:err.message})
    let error={...err}
    error.message=err.message
    console.log(err)
    // case of bad objectId
    if(err.name === 'Error'){
        console.log(err)
      let message=`Ressources not found with  such id ${req.params.id}`   
      error=new ErrorResponse(message,400)
    }
    // @descr duplication code for mongoose object
    if(err.code === 11000){
        let message=`error diplicated intries values...`   
        error=new ErrorResponse(message,400)
    }
    // if(err.name ===  'validatorError'){
    //     let message=Object.values(err.errors).map(val => val.message)
    //     console.log(message.yellow)
    //     error=new ErrorResponse(message,400)
    // }
    
    res.status(error.statusCode || 500).json({success:false,err:error.message || 'server error...'})
    
}
module.exports =errorHandler