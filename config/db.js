const mongoose=require('mongoose')


const MONGO_URI="mongodb:??"

const connectBd=async()=>{

     
    try {
        const con=await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex:true,
            useFindAndModify:false  
          })
          console.log(`connected to the database and ${con.connection.host}`.cyan.bold)
    
    } catch (error) {
       console.log(error)   
    }
    }
module.exports =connectBd