const ansyncHandler=require('../middleware/async.js')
const ErrorResponse=require('../utils/errorResponse.js')
const User=require('../models/User.js')

const jwt=require('jsonwebtoken')


// protect route
exports.protect=ansyncHandler(async (req,res,next)=>{
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

        token=req.headers.authorization.split(' ')[1]
    }
    // else if(req.cookies.token){
    //     token=req.cookies.token
    // }
    // chec if the token exist
    if(!token){
        return next(new ErrorResponse('not autorized ',401))
    }
    // then we can check the token
    try {
        // verify the token
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        // as we signed with {id} the decode will handles the {id}
        console.log(decode)
        req.user=await User.findById(decode.id)
        
        next()
    } catch (error) {
        return next(new ErrorResponse('not autorized ',401))
        
    }
    
})
// here we grant access to the user
exports.autorize=(...role)=>{
    
    return(req,res,next)=>{
        if(!role.includes(req.user.role)){
            return next(new ErrorResponse( `USER WITH ${req.user.role}`,403))

        }
        next()
    }
}
