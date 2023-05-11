const mongoose = require('mongoose')

const MONGO_URL = process.env.DATABASE

mongoose.connect(MONGO_URL).then(()=>{
    console.log("Database connected successfully")
}).catch((error)=>{
    console.log("Error :",error.message)
})