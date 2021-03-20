const mongoose=require('mongoose')
const fs=require('fs')
const dotenv=require('dotenv')
const BootCamp=require('./models/Bootcamp.js')
const { json } = require('body-parser')


dotenv.config({path:'./config/config.env'})


mongoose.connect(process.env.MONGO_URI,{
    useCreateIndex:true,
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useFindAndModify:true
})


// @descr read the file the json bootcamps datain _data directory
const bootcamps=JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))