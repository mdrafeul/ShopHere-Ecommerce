const Product = require('../model/product');
const dotenv = require('dotenv');
const connectDatabase = require ('../config/database');
const products = require('../data/product.json');

dotenv.config({path: 'backend/config/config.env'})

connectDatabase();
const seedProducts = async(req, res, post)=>{
    try{
        await Product.deleteMany();
        console.log('Products are deleted');
        await Product.insertMany(products);
        console.log('All products are added');
    }catch(error){
        console.log(error.message)
        process.exit()
    }
}

seedProducts();