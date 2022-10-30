const AppError = require('../utils/appError');
const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');



const filterObj= (obj, ...allowFields) => {
    const newObj = {};

    
    Object.keys(obj).forEach(el => {
        if(allowFields.includes(el)) newObj[el]=obj[el];
    })

    return newObj;
};

exports.getAllUsers = async (req, res) =>{
    const users = await User.find() ;

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
           users
        }
    });
}

exports.getUser = factory.getOne(User);

//to create user the user must use sign up, route never will be implemented
exports.createUser = factory.createOne(User);
// DO NOT UPDATE PASSWORD WITH THIS (VALIDATOR DOESN'T WORK)
exports.updateUser= factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);




exports.deleteMe= catchAsync(async (req, res, next) => {



    await User.findByIdAndUpdate(req.user.id, {active:false});


    res.status(204).json({
        status: 'success',
        data: null
    });

});

exports.updateMe = async (req, res, next)=>{

  
    //create an error if user wants 
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('This route is not for password updates. Please'), 400);
    };

    const filteredBody = filterObj(req.body, 'name', 'surname', 'email' );

//i'm using find by id and update because i don't work with pass
    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody , {
        new:true,
        runValidators: true,
    } );


    res.status(200).json({
        status: "success",
        data:{
            user: updateUser
        }
    });
};

exports.getMe = (req, res, next) =>{

    req.params.id = req.user.id;


    next();
};