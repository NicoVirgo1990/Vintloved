
const express = require('express');
const modelController = require('./../controller/modelController');
const authController = require('./../controller/authController');

const itemRouter = require('./itemRouter');
// model REST


// it need to allow to use router.route like this and use simple /
// without write all the link
const router = express.Router();


router.use('/:modelId/item', itemRouter);

//params mddelware 
router.param('id', (req, res, next, val)=>{
    console.log(`this is Model ${val}`);
    next();
});

//router.route('/cheapest-items').get( modelController.aliasCheapestItems,  modelController.getAllItems);
router.route('/model-stats').get(modelController.getModelStats);

router
    .route('/')
    .get( modelController.getAllModels)
    .post(authController.protect, authController.restrictTo('admin'), modelController.createModel);



router
    .route('/:id')
    .get(modelController.getModel)
    .patch(authController.protect, authController.restrictTo('admin'), modelController.updateModel)
    .delete(authController.protect, authController.restrictTo('admin') ,modelController.deleteModel);



module.exports = router;