
const AppError = require('../utils/appError');


const handleCastErrorDB = err =>{
    const message = ` Invalid ${err.path}: ${err.value}`

    return new AppError(message, 400);
};

const handleDuplicateFieldsDB= err =>{
    const message = `Duplicate fields value ${err.keyValue.brand} and ${err.keyValue.model} . Please use another value`;

    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {

    const errors = Object.values(err.errors).map(el => el.message);;

    const message = `Invalid input data. ${errors.join('. ')}`;

    return new AppError(message, 400);
};

handleNotAuthorized = err=>{
    message = err.message;
    return new AppError(message, 403);
};

const handleJWTError = () => new AppError('Token non valido, perfavore log in ancora!',401);

handleJWTExpiredError = () => new AppError('Token scaduto, perfavore log in ancora!',401);

const sendErrorDev = (err, res) =>{


    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    if(err.isOperational){
    
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
         });
    }else {
        //1) log error
        console.error('ERROR', err);

        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
   
};


module.exports = (err, req, res, next) => {
    console.log(err.stack, 'STACK');

    err.statusCode= err.statusCode || 500;
    err.status= err.status || 'error'
  
    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res);
    }else if(process.env.NODE_ENV === 'production'){    
        //Error from Mongo
        //hard copy of err
    
        let error = {...err};
        
        error.message = err.message;
        
        if(err.name === 'CastError') error =  handleCastErrorDB(err);
        if(err.code === 11000) error = handleDuplicateFieldsDB(err);
        if(err.name === 'ValidationError') error = handleValidationErrorDB(err);
        if(err.name === 'JsonWebTokenError') error = handleJWTError(err);
        if(err.name === 'TokenExpiredError') error = handleJWTExpiredError(err);
        if(err.statusCode === 403) error = handleNotAuthorized(err);
        sendErrorProd(error, res);
    };
};
