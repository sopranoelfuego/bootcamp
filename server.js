const path=require('path')
const express=require('express')
const dotenv=require('dotenv')
const app=express()
const colors=require('colors')
const morgan=require('morgan')
const logger=require('./middleware/logger.js')
const connectBd =require('./config/db')
const errorHandler=require('./middleware/error.js')
const fileupload=require('express-fileupload')
const cookieParser=require('cookie-parser')

// load .env variables
dotenv.config({path:'./config/config.env'})

connectBd()

const bootcampRoute=require('./routes/bootcamps.js')
const courseRoute=require('./routes/courses.js')
const port = process.env.PORT || 5000
const authRoute=require('./routes/auth.js')

//@descr here we use morgan in devlpment 
 
if(process.env.NODE_ENV === 'development'){
   app.use(morgan('dev'))
}
app.use(express.static(path.join(__dirname,'public')))
app.use(fileupload())
app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/bootcamps',bootcampRoute)
app.use('/api/v1/courses',courseRoute)
app.use('/api/v1/auth',authRoute)
app.use(errorHandler)
// midlware which deal with files(photo)
const server=app.listen(port,()=>console.log(`connected to ${process.env.NODE_ENV}the port`,port.yellow.bold))

// @descr here i handle the unhandled promise rejection
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error:${err.message}`.red)
    // @descr then i close the server and exit process
    server.close(()=>process.exit(1))
})