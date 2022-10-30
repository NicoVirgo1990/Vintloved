// this app has got a global review system: it belong to the company nor

const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    ratingsAverage:{
        type: Number,
        default: 4.5,
      },
      ratingsQuantity:{
        type: Number,
        default: 0
      },
      
});


const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;