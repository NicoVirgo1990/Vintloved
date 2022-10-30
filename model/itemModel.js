const mongoose = require('mongoose');
const Rating = require('./../model/ratingModel');




const itemSchema = new mongoose.Schema({
    model: {
     type: mongoose.Schema.ObjectId,
     ref: 'Model',
     required: [true, 'un articolo deve essere associato ad un modello']
    },
    condition: {
        type: String,
        enum: ['discrete','buone','ottime','eccellenti','mai usato'],
        required: [true , "specifica le condizioni dell'articolo"]
    },
   
    price: {
        type: Number,
        required:[true, 'un articolo deve avere un prezzo']
    },
    showOne: {
      type: Boolean,
      default: false

    },
    showTwo: {
      type: Boolean,
      default: false

    },
    showThree: {
      type: Boolean,
      default: false

    },
    showFour: {
      type: Boolean,
      default: false
  
    },
    imageCover:{
      type: String,
      required: [true, 'Un modello deve avere una immagine di copertina']
    },
    images: [String],
    dustbag: {
      type: Boolean,
      default: false,
    },
    box: {
      type: Boolean,
      default: false,
    },
    purchased:[
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
          },
          review:{
            type: String
          },
          rating:{
            type: Number,
            min: [1 , 'Rating must be above 1.0'],
            max: [5,'Rating must be below 5.0']
          },

          date: {
            type:Date,
            default: Date.now(),
          }
        }
    ],
    features: {
        type: String,
    }

},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});


itemSchema.index({showOne: 1}, {unique: true, partialFilterExpression: {showOne: true}});
itemSchema.index({showTwo: 1}, {unique: true, partialFilterExpression: {showTwo: true}});
itemSchema.index({showThree: 1}, {unique: true, partialFilterExpression: {showThree: true}});
itemSchema.index({showFour: 1}, {unique: true, partialFilterExpression: {showFour: true}});

itemSchema.pre(/^find/, function(next){

  this.populate({
    path: 'model',
    select: 'brand model description'
  }).select(' -__v');

  next();
});

itemSchema.statics.calcAverageRatings  = async function() {
  const stats = await this.aggregate([
    
    {
      // i access only to sold items
     $match: {purchased: {$nin: [null, []]} }
    },
    {
     $unwind: '$purchased'
    }
  ])


  let statsRating;
  let allRatings;
  let avgRatings;
  let nRatings;

  //remove object that haven't rating
  statsRating = stats.filter( el => {
    return el.purchased.rating != undefined;
  });

 

  nRatings = statsRating.length;

  allRatings = statsRating.map(el => el.purchased.rating);

  avgRatings = allRatings.reduce((sum ,number) =>{
   const avgSum =  (sum + number) 
  return avgSum;
  }, 0);

  avgRatings = Object.is(avgRatings / nRatings, NaN) ? avgRatings / (nRatings + 1) : avgRatings / nRatings;
 

  const ratingId = "63111534172652a636e50bf4"


  await Rating.findByIdAndUpdate( ratingId , {
    ratingsQuantity: nRatings,
    ratingsAverage: avgRatings
  });


  
};





// itemSchema.post('save', function() {
//   // this points to current review
//   this.constructor.calcAverageRatings();
// });


// in case user or admin modify or delete a review
itemSchema.pre(/^findOneAnd/, async function(next){
  // we can make it only because the query isn't executed
  this.item = await this.findOne();
  next();
});



itemSchema.post(/^findOneAnd/, async function() {
// questa funzione deve essere chiamata solo quando il rating delle'elemento corrente
//è inserito


 await this.item.constructor.calcAverageRatings();
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;