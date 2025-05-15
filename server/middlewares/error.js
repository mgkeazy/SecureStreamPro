import ErrorHandler from "../utils/ErrorHandler.js";

export const Errormiddleware = (err,req,res,next) =>{
    err.statusCode= err.statusCode || 500
    err.message =err.message || 'Internal Server Error'

    //wrong mongoDB id error
    if(err.name == 'CastError'){
        err= new ErrorHandler(message,400);
    }

    // Duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message,400);
    }

    if(err.name === 'JsonWebTokenError'){
        const message = 'Json web tooken is invalid, try again';
        err = new ErrorHandler(message,400);
    }

    if(err.name === 'TokenExpiredError'){
        const message = 'Json web tooken is expired, try again';
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })

}