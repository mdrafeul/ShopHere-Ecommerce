const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, 'Product name cannot excced 100 character']
    },
    price:{
        type: Number,
        required: [true, 'Please enter product price'],
        maxLength: [5, 'Product name cannot excced 5 character'],
        default: 0.0
    },
    description:{
        type: String,
        required: [true, 'Please enter product description']
    },
    ratings:{
        type: Number,
        default: 0
    },
    images: [
        {
            public_id:{
                type: String,
                required: true
            },
            url:{
                type: String,
                required: true
            }
        }
    ],
    category:{
        type: String,
        required: [true, 'Please select the category of the product'],
        enum: {
            values:[
                'Accessories',
                'Electronics',
                'Cameras',
                'Laptops',
                'Food',
                'Books',
                'Cloths/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                "Headphones",
                'Home'
            ],
            message: 'Please select correct category for the product'
        }
    },
    seller: {
        type: String,
        required: [true, 'Please enter product seller']
    },
    stock:{
        type: Number,
        required: [true, 'Please enter product Stock'],
        maxLength: [5, 'Product name cannot excced 5 character'],
        default: 0
    },
    numofReviews:{
        type: Number,
        default: 0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref: "User",
                require: true
             },
            name:{
                type: String,
                required: true
            },
            rating:{
                type: Number,
                required:true
            },
            comment:{
                type: String,
                required: true,
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref: "User",
        require: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product',productSchema);