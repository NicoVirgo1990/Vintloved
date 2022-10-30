
const Item = require('.././model/itemModel');
const catchAsync = require('../utils/catchAsync');


exports.getHome = catchAsync(  async (req, res) => {
    const itemsShow = await Item.find({ $or: [ { showOne: true }, {showTwo: true}, { showThree: true }, {showFour: true} ] }); 

     res.status(200).render('home',{
        title: 'home',
        itemsShow
     });
});

exports.getItem = catchAsync( async(req, res) => {

    const item = await Item.findById(req.params.id); 

 
    res.status(200).render('item',{
       title: 'item',
       item
    });
});


exports.getAuthenticity = catchAsync( async(req, res) => {

 
    res.status(200).render('authenticity',{
       title: 'authenticity'
    });
});

exports.getShop = catchAsync( async (req, res) => {
  
    const items = await Item.find(); 

    res.status(200).render('shop',{
       title: 'shop',
        items
    });
});

exports.getLouisVuitton  = catchAsync( async (req, res) => {
    console.log('ciao');
    let items = await Item.find(); 
    items = items.filter(el =>  el.model.brand === 'louis vuitton' );

    res.status(200).render('shop',{
       title: 'Louis Vuitton',
        items
    });
});



