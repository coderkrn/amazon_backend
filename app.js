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

app.use(express.json())
app.use(cookieParser(''))

app.use(router);

const port = 8005;

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})

DefaultData();
