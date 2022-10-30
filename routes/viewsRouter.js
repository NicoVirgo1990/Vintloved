

const express = require('express');
const viewsController = require('./../controller/viewsController');
const router = express.Router();


router.get('/', viewsController.getHome );

router
  .route('/louisvuitton')
  .get(viewsController.getLouisVuitton);
  
router
  .route('/shop')
  .get(viewsController.getShop);

router
  .route('/authenticity')
  .get(viewsController.getAuthenticity)


router
  .route('/item/:id')
  .get(viewsController.getItem);



module.exports = router;
