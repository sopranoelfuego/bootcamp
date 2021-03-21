const express=require('express')
const dotenv=require('dotenv')
const app=express()
const colors=require('colors')
const morgan=require('morgan')
const logger=require('./middleware/logger.js')
const connectBd =require('./config/db')
const errorHandler=require('./middleware/error.js')

// load .env variables
dotenv.config({path:'./config/config.env'})

connectBd()
const bootcampRoute=require('./routes/bootcamps.js')
const courseRoute=require('./routes/courses.js')
const port = process.env.PORT || 5000

//@descr here we use morgan in devlpment 
 
if(process.env.NODE_ENV === 'development'){
   app.use(morgan('dev'))
}
app.use(express.json())
app.use('/api/v1/bootcamps',bootcampRoute)
app.use('/api/v1/courses',courseRoute)
app.use(errorHandler)
const server=app.listen(port,()=>console.log(`connected to ${process.env.NODE_ENV}the port`,port.yellow.bold))

// @descr here i handle the unhandled promise rejection
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error:${err.message}`.red)
    // @descr then i close the server and exit process
    server.close(()=>process.exit(1))
})