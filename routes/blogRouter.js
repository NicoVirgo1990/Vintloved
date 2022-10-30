const express = require('express');
const blogController = require('./../controller/blogController');
const authController = require('./../controller/authController');


const router = express.Router();


router
    .route('/')
    .get(blogController.getAllblogs)
    .post(authController.protect, authController.restrictTo('admin'), blogController.createBlog);


router
    .route('/:id')
    .get(blogController.getBlog)
    .patch(authController.protect, authController.restrictTo('admin'), blogController.updateBlog)
    .delete(authController.protect, authController.restrictTo('admin'), blogController.deleteBlog);


module.exports = router;