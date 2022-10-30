
const slugify = require('slugify');
const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
    brand:{
       type: String,
       required: [true, 'Un modello deve avere un marchio'],
       trim: true,
       maxlength: [40, "il nome di un modello non deve avere piu' di 20 caratteri"]
    },
    model:{
       type: String,
       //in case of no know model: also
       required: [true, 'Un modello deve avere un nome'],
       trim: true,
    },
    version: {
      type: String
    },
    slug: String,
    size:{
         length: Number,
         height: Number,
         width: Number
    },
    outProduction:{
      type: Boolean,
      default: false
    },
    description:{
      type: String,
      required: [true, 'un modello deve avere una descrizione']
    },
    blog:{
      type:  mongoose.Schema.ObjectId,
      ref: 'Blog'
    },
    imageCover:{
      type: String,
      required: [true, 'Un modello deve avere una immagine di copertina']
    },

 },
 {
   toJSON: {virtuals:true},
   toObject: {virtuals: true}
 }
);


modelSchema.virtual('item', {
  ref: 'Item',
  foreignField: 'model',
  localField: '_id'
});


modelSchema.virtual('pound').get(function(){



});





modelSchema.index({ brand: 1, model: 1}, { unique: true });

// without sense it is empty :)
modelSchema.pre('find', function(next){
   next();
});


// RUN BEFORE SAVE AND CREATE
modelSchema.pre('save', function(next){
   this.slug = slugify(this.model, {lower:true});
   next();
});


// Model is the name of the document and not the model schema
const Model = mongoose.model('Model', modelSchema);


module.exports = Model;


