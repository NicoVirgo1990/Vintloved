const Model = require('./../model/modelModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
 
// this function will be on items controller
// exports.aliasCheapestItems = (req, res, next) =>{
//     req.query.sort = '-price';
//     req.query.price = {lt: '700'} 
//     next();
// };



exports.getAllModels = factory.getAll(Model);
exports.getModel = factory.getOne( Model , {path: 'models'});
exports.createModel = factory.createOne(Model);
exports.updateModel= factory.updateOne(Model);
exports.deleteModel = factory.deleteOne(Model);

exports.getModelStats = catchAsync(async (req, res, next)=>{

    const stats = await Model.aggregate([

        {
            $match: {ratingsAverage: { $gte: 0}}
        },
        {
            $group: {
                _id: null,
                numModel: {$sum:1},
                avgQuantity: {$sum: '$ratingsQuantity'},
                avgRating: {$avg: '$ratingsAverage'}
            }
// i can sort by a value if it would be group by an id
        }
    ]);



    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
 
});


