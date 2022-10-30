
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');


exports.deleteOne = Model => catchAsync( async(req, res, next) =>{

    const doc = await Model.findByIdAndDelete(req.params.id);
 
    if(!doc){
         return next(new AppError('Nessun documento trovato con questo ID', 404));
    }
 
     res.status(204).json({
         status: 'success',
         data: null,
     });
   
});

exports.updateOne = Model =>  catchAsync( async(req,res, next) =>{
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        // the updated documents is the one that will be returned
        new: true,
        runValidators: true
    } );

    
   if(!doc){
         return next(new AppError('Nessun documento trovato con questo ID', 404));
   }

    res.status(201).json({
        status: 'success',
        data: {
            doc
        }
    });
});


// we must be carefull: Model doesn't refer to Model of Bag but it is a general Model
exports.createOne = Model => catchAsync( async (req,res, next) =>{

    const newDoc = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            newDoc
        }
    });     
});

exports.getOne = (Model, popOptions) => catchAsync( async(req, res, next) =>{
    
    let query= Model.findById(req.params.id);

    if(popOptions) query.populate(popOptions);

    const doc = await query;

    if(!doc){
        //return because it must give error immediately  
        return next(new AppError('Nessun doc trovato con questo ID', 404));
    };

    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
});


exports.getAll = Model => catchAsync( async(req , res, next) =>  {
    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(), req.query, req)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const docs = await features.query ;

    res.status(200).json({
        status: 'success',
        results: docs.length,
        data: {
            docs
        }
    });
});
