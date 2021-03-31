const ErrorHandler = require ('../utils/errorHandler');


module.exports = (err, req, res,next) =>{
    err.statusCode = err.statusCode || 505;
    /* Two if statement and this line is removed to represent
     error messa in production and dev modeerr.message = err.message || 'Internal Server Error';*/
    if(process.env.NODE_ENV === "DEVELOPMENT"){
        res.status(err.statusCode).json({
            sucess: false,
            error: err,
            errorMessage: err.message,
            stack: err.stack
        })
    }

    if(process.env.NODE_ENV === "PRODUCTION"){
        let error = {...err}
        err.message = err.message;


        //Wrong mongoose obj id error
        if(err.name === 'CastError'){
            const message = `Resource not found: invalid: ${err.path}`
            error = new ErrorHandler(message,400)
        }
        //Handling validation error show all the errors
        if(err.name ==='validationError'){
            const message = Object.values(err.errors).map(value=>value.message);
            error = new ErrorHandler(message,400)
        }

        //Handling the mongoose duplicate key errors
        if(err.code===11000){
            const message = `Duplicate ${object.keys(err.keyvalue)}entered`
            error = new ErrorHandler(message,400)
        }
        //handling wrong jwt error
        if(err.name ==='JsonWebTokenError'){
            const message = 'Json web token is invalid. try again'
            error = new ErrorHandler(message,400)
        }

        //Handling expired jwt error
        if(err.name ==='TokenExpiredErro'){
            const message = 'Json web token is Expire. try again'
            error = new ErrorHandler(message,400)
        }
        res.status (err.statusCode).json({
            sucess: false,
            message: error.message||"Internal Server Error"
        })
    }
}