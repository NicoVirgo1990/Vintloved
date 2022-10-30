
const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');
// user REST

// it need to allow to use router.route like this and use simple /
// without write all the link
const router = express.Router();

router.post('/signup', authController.signup)
router.post('/login', authController.login)


router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);




router.get('/me', authController.protect, userController.getMe, userController.getUser);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.patch('/updateMyPassword', authController.protect, authController.updatePassword);
router.delete('/deleteMe', authController.protect, userController.deleteMe);


router
     .route('/')
     .get(authController.protect, authController.restrictTo('admin'), userController.getAllUsers)
     .post(authController.protect, authController.restrictTo('admin'), userController.createUser);

router.route('/:id')
    .get(authController.protect, authController.restrictTo('admin'), userController.getUser)
    .patch(authController.protect, authController.restrictTo('admin'), userController.updateUser)
    .delete(authController.protect, authController.restrictTo('admin'), userController.deleteUser);







module.exports = router;