const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxlength: [30, 'Your name cannot exceed 30 character']
    },
    email:{
        type: String,
        required: [true, 'Please enter e-mail address'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid e-mail id']
    },
    password:{
        type: String,
        require: [true, 'Please enter a password'],
        minlength: [6, 'Password cannot be less than 6 character'],
        select: false
    },
    avatar:{
        public_id:{
            type: String,
            require: true
        },
        url:{
            type: String,
            required: true
        }
    },
    role:{
        type: String,
        default: 'user'
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

//Encrypt Password before save
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password= await bcrypt.hash(this.password, 10)
})

//Return JWT Token
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

//compare user password
userSchema.methods.comparePassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword, this.password)
}

//Generate Forgot Password Token
userSchema.methods.getResetPasswordToken = function(){
    //Generate Token
    const resetToekn = crypto.randomBytes(20).toString('hex');
    //Hast and set to rest PasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToekn).digest('hex')
    //set Token expire time
    this.resetPasswordExpire = Date.now() + 30*60*1000
    return resetToekn
}




module.exports = mongoose.model('User',userSchema)