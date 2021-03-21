const mongoose=require('mongoose')
const fs=require('fs')
const colors=require('colors')
const dotenv=require('dotenv')
const BootCamp=require('./models/Bootcamp.js')
const { json } = require('body-parser')
const Bootcamp = require('./models/Bootcamp.js')


dotenv.config({path:'./config/config.env'})


mongoose.connect(process.env.MONGO_URI,{
    useCreateIndex:true,
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useFindAndModify:true
})


// @descr read the file the json bootcamps datain _data directory
const bootcamps=JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))

// @desc import to the database 
const importDataToTheDatabase=async()=>{
    try {
        if(bootcamps){
            await Bootcamp.create(bootcamps)
            console.log("congratulations data are imported succefully..")
        }
        process.exit()
    } catch (error) {
        console.error(error.message)
    }

}
// @descr destroy database 
const deleteDatabaseRecords=async()=>{

    try {
        await BootCamp.deleteMany()
        console.log("delete succefully".green.inverse)
    } catch (error) {
        console.error(error.message)
    }
}

if(process.argv[2] === "-i"){
   importDataToTheDatabase()
}else if(process.argv[2] === "-d"){
    deleteDatabaseRecords()
}