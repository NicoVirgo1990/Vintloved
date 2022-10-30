const express = require('express');
const itemController = require('./../controller/itemController');
const authController = require('./../controller/authController');


const router = express.Router({mergeParams: true});


    

router
    .route('/under700')
    .get(itemController.under700);

router
    .route('/purchased')
    .get(authController.protect, authController.restrictTo('admin'),itemController.getAllPurchased)

router
    .route('/purchased/:id')
    .patch(authController.protect, authController.restrictTo('admin'),itemController.updatePurchased);
router
    .route('/')
    .get(itemController.getAllItems)
    .post(authController.protect, authController.restrictTo('admin'), itemController.setItemIds, itemController.createItem);




router
    .route('/:id')
    .get(itemController.getItem)
    .delete(itemController.deleteItem)
    .patch(itemController.updateItem);

module.exports = router;