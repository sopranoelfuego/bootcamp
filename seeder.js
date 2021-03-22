// const mongoose=require('mongoose')
// const fs=require('fs')
// const colors=require('colors')
// const dotenv=require('dotenv')
// const BootCamp=require('./models/Bootcamp.js')
// const { json } = require('body-parser')
// const Bootcamp = require('./models/Bootcamp.js')


// dotenv.config({path:'./config/config.env'})


// mongoose.connect(process.env.MONGO_URI,{
//     useCreateIndex:true,
//     useUnifiedTopology:true,
//     useNewUrlParser:true,
//     useFindAndModify:true
// })


// // @descr read the file the json bootcamps datain _data directory
// const bootcamps=JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))

// // @desc import to the database 
// const importDataToTheDatabase=async()=>{
//     try {
//         if(bootcamps){
//             await Bootcamp.create(bootcamps)
//             console.log("congratulations data are imported succefully..")
//         }
//         process.exit()
//     } catch (error) {
//         console.error(error.message)
//     }

// }
// // @descr destroy database 
// const deleteDatabaseRecords=async()=>{

//     try {
//         await BootCamp.deleteMany()
//         console.log("delete succefully".green.inverse)
//     } catch (error) {
//         console.error(error.message)
//     }
// }

// if(process.argv[2] === "-i"){
//    importDataToTheDatabase()
// }else if(process.argv[2] === "-d"){
//     deleteDatabaseRecords()
// }



const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
// const User = require('./models/User');
// const Review = require('./models/Review');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);



// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    // await User.deleteMany();
    // await Review.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}