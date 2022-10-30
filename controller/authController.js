const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const {promisify} = require('util');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');



const signToken= id =>{
    return jwt.sign( {id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
} ;   


const createSendToken = (user, statusCode, res) =>{

    const token = signToken(user._id);
    const cookieOptions = {
            expires: new  Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true     
    }

    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    //remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user
        }
    });
};


exports.signup = catchAsync( async(req, res, next) =>{

    console.log(req.body);

    const newUser = await User.create({
        name: req.body.name,
        surname:req.body.surname,
        email: req.body.email,
        dateBirth: req.body.dateBirth,
        password: req.body.password,
        photo: req.body.photo,
        passwordConfirm: req.body.passwordConfirm,
        numberuser: req.body.numberuser,
        address: req.body.address,
        street: req.body.street,
        zipcode: req.body.zipcode,
        country: req.body.country,
        city: req.body.city
           
    });

    createSendToken(newUser, 201, res);


});

exports.login =catchAsync( async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password){
       return next(new AppError('Fornisci sia la mail che la password!', 400));
    }

    const user = await User.findOne({email}).select('+password');



    if(!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError('e-mail o password non corretti', 401));
    }

    createSendToken(user, 200, res);
});

exports.protect = catchAsync(async(req, res, next) => {
   
    let token;
    // Getting the token 
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
      }
      
    if(!token){
        return next(new AppError('esegui il log in per accedere', 401));
    }
    //verification token
    const decoded=  await  promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    //check user exist
   const currentUser = await User.findById(decoded.id);
    if(!currentUser) return new AppError("l'utente a cui appartiene il token non esiste piu'", 401);

    //check user change password after jwt was issued
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(
            new AppError("l'utente ha cambiato password recentemente! Perfavore riesegui il log in", 401)
        );
    };

    //GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) =>{
    return (req,res, next) =>{
        if(!roles.includes(req.user.role)) {
          return next(
              new AppError('Non hai il permesso di eseguire questa azione', 403)
           );
        };  
        next();
    };
};

exports.forgotPassword =catchAsync( async (req, res, next) =>{
    // user based on email
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next( new AppError('Non vi è la e-mail specificata', 404));
    }
    //generate random token
    const resetToken = user.createPasswordResetToken();

    //deactivate validator to save user
    await user.save({validateBeforeSave: false});

    //send it back wih email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

    const message = `Hai dimenticato la password? Esegui una richiesta PATCH per la tua nuova password e confermala al ${resetURL}.\n Se non hai dimenticato la tua password perfavore ignora questa mail`

    try{
        
    await sendEmail({
        email: user.email,
        subject: 'Pssword reset: valido per 10 minuti! ',
        message
    });

    res.status(200).json({
        status:'success',
        message: 'Token sent to email!'
    });

    }catch(err){
        user.passwordResetToken= undefined;
        user.passwordResetToken = undefined;
        await user.save({validateBeforeSave: false});

        return next(new AppError("errore nell'invio della mail. Prova ancora"), 500);
    }


});


exports.resetPassword =catchAsync(async (req, res, next) =>{
    // get user based on the token


    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

   
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    });

    // if the token isn't expired

    if(!user){
        return next(new AppError('Token is invalid or has expired', 400));
    }


    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken= undefined;
    user.passwordResetExpires=undefined;

    //update changedPassword property for the user
    await user.save();

    //send jwt to the client
    token = signToken(user._id);

    res.status(200).json({
        status:'success',
        token
    });
   

});

exports.updatePassword =catchAsync(async(req, res, next) =>{

    //  Get user from DB


    const user =await  User.findById(req.user.id).select('+password');

    
    // check if the previous password is corrct

    if(!( await user.correctPassword(req.body.passwordCurrent, user.password))){
        return next(new AppError('Your current password is wrong', 401))
    }

    //  if so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();
 
    createSendToken(user, 200, res);

}) ;

