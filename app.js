require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose')
require('./database/connection')
const Products = require('./models/productSchema')
const cors = require('cors')
const router = require('./routes/router')
const cookieParser = require('cookie-parser')


const DefaultData = require('./defaultData')

app.use(cors())
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*")
    req.header(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    )
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
})

app.use(express.json())
app.use(cookieParser(''))

app.use(router);

app.get('/', (req, res)=>{
   res.send("<h1>Hello world</h1>")
})

const port = 8005;

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})

DefaultData();
