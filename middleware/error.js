



const errorHandler=(err,req,res,nex)=>{
    console.log(errr.stack.red)
    res.stack(500).json({success:false,err:err})

}
module.exports =errorHandler