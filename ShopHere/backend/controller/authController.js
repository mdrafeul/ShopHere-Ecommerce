const User = require('../model/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/jwtToken')

const crypto = require ('crypto');
const user = require('../model/user');




//Register a user => /api/v1/register
exports.registerUser = catchAsyncError (async(req,res,next)=>{
    const {name, email, password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"samples/people/boy-snow-hoodie.jpg",
            url:"https://res.cloudinary.com/mdrafeul/image/upload/v1615370076/samples/people/boy-snow-hoodie.jpg"
        }
    })

    sendToken(user,200,res);

})

//Login User => /api/v1/login
exports.loginUser = catchAsyncError(async (req,res, next)=>{
    const {email, password} = req.body;
    //check if email and password entered by user
    if(!email || !password){
        return next(new ErrorHandler('Please enter email and password', 404))
    }
    //Find user in Database
    const user = await User.findOne({email}).select('+password');
    //if user not in database
    if(!user){
        return next(new ErrorHandler('Invalid email or password', 404));
    }
    //check if password correct or not
    const isPasswordMatched = await user.comparePassword(password) 
    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or password', 404));
    }
    sendToken(user,200,res);
})

//Forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new ErrorHandler('User not found with this email', 404));
    }
    //Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave:false})

    //Create a reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`
    //To send email
    try{
        await sendEmail({
            email:user.email,
            subject: 'ShopHere Password Recovery',
            message
        })
        res.status(200).json({
            succes: true,
            message: `Email send to ${user.email}`
        })
    }catch(error){
        user.resetPasswordToken  = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave:false})
        return next(new ErrorHandler(error.message,500))
    }

})

//Show User Profile /api/v1/me
exports.getUserProfile = catchAsyncError(async (req,res,next)=>{
    const user = await User.findById(req.user.id);
    console.log(user)
    res.status(200).json({
        succes: true,
        user
    })
})

//Update or change password /api/v1/password/update
exports.updatePassword = catchAsyncError(async (req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password');
    //Check current password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if(!isMatched){
        return next(new ErrorHandler('Password is incorrect'))
    }
    user.password = req.body.password
    await user.save()
    sendToken(user, 200, res)
})

//Update use profile /api/v1/me/update
exports.updateProfile = catchAsyncError(async(req,res,next)=>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
        new: true,
        runValidators: true,
        userFindAndModify: false
    })
    res.status(200).json({
        succes: true
    })
})

//LogOut user => /api/v1/logout 
//Important idea is here to remove token when use logout
exports.logout = catchAsyncError(async(req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
           succes: true,
           message: "Logged Out"
    })
})

//Reset the new Password /api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async(req,res,next)=>{
    //Hash URL Token
    const resetPasswordToken = crypto.createHash('sha250').update(req.params.token).digest('hex')
    const user = await user.findOne({
        resetPasswordToken, 
        resetPasswordExpire:{$gt:Date.now()}
    })
    if(!user){
        return next(new ErrorHandler('Password resed token is invalid or expire', 400))
    }
    if(req.body.password!== req.body.confirmPassword){
         return next(new ErrorHandler('Password does not match', 400))
    }
    //setup new password
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    sendToken(user, 200, res)
})


//Admin get all users & specific user /api/v1/admin/users
exports.allUsers = catchAsyncError(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        succes: true,
        users
    })
})
//Admin get specific user details /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler('No user available with this id', 400))
    }
    res.status(200).json({
        succes: true,
        user
    })

})

//Admin update user profile /api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async(req,res,next)=>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
        new: true,
        runValidators: true,
        userFindAndModify: false
    })
    res.status(200).json({
        succes: true
    })
})

//Admin delete a user /api/v1/admin/user/:id

exports.deleteUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler('No user available with this id', 400))
    }
    await user.remove();
    res.status(200).json({
        succes: true,
        user
    })

})

