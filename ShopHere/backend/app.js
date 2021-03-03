//https://github.com/ghulamabbas2/shopit

const express = require('express');
//const bodyParser = require('body-parser');
const app =  express();

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


//import all routes
const products = require('./routes/product');
app.use('/api/v1', products)



module.exports = app