const Item = require('./../model/itemModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');





exports.setItemIds = (req, rea, next) => {
    if(!req.body.model) req.body.model = req.params.modelId;

    next();
};



console.log('NUMEROOOOOOO', Item);
exports.getAllItems= factory.getAll(Item);
exports.getItem = factory.getOne(Item);
exports.createItem = factory.createOne(Item);
exports.deleteItem = factory.deleteOne(Item);
exports.updateItem= factory.updateOne(Item);

exports.under700 = catchAsync(async (req, res, next)=>{

    const itemUnder700 = await Item.find(
        {
         price:{ $lte: 700}
        }
    );
  
    res.status(200).json({
        status: 'success',
        data: {
            itemUnder700
        }
    }); 
});



//get  all bought items
const filtBoughtItems = function(items) {
    return items
      .map( el => el.purchased)
      .filter( el => {
          return el.length !== 0;
      });
};
  
exports.getAllPurchased = catchAsync(async (req, res, next) =>{
    const items = await Item.find()

    purchased = filtBoughtItems(items);

    res.status(200).json({
        status: 'success',
        itemsSold: purchased.length,
        data: {
            purchased
        }
    });
});


// admin can create o delete purchased from here
exports.updatePurchased = catchAsync(async (req, res, next) =>{
    let item= await Item.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    });

    res.status(204).json({
        status: 'success',
        data: {
        }
    });
});
