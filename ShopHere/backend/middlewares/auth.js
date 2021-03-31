const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('./catchAsyncError')
const User = require('../model/user')


//check if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncError(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler('Login first to access', 400))
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next()
})

//Authorization Roles and Permission => Handle user roles
exports.authorizeRoles = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role (${req.user.role}) is not to access`,403))
        }
        next()
    }
}
