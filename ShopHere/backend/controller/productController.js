const Product = require('../model/product');
//create new product => api/v1/product/view

exports.newProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        
        res.status(201).json({
            success: true,
            product
        })
    } catch(error) {
        console.log(error);
    }
}


exports.getProducts = (req,res,next)=>{
    res.status(200).json({
        success: true,
        message: "This route will show all data from DB"
    })
}