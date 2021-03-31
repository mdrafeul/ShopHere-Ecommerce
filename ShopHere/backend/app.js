//https://github.com/ghulamabbas2/shopit

const express = require('express');
//const bodyParser = require('body-parser');
const app =  express();

const errorMiddleware = require('./middlewares/error')
const cookieParser = require('cookie-parser')

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


//import all routes
const products = require('./routes/product');
const auth = require('./routes/auth')
const order = require('./routes/order')

app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1', order)

//Middleware to handle errors
app.use(errorMiddleware);


module.exports = app