const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'inserisci il tuo nome perfavore']
    },
    surname:{
        type: String,
        required:[true,'inserisci il tuo cognome perfavore']
    },
    dateBirth:{
        type: Date,
        required: [true, 'inserisci la tua data di nascita']
    },
    email: {
        type: String,
        required:[true, 'inserisci la tua e-mail perfavore'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail,'inserisci un indirizzo mail valido']
    },
    address:{
        type: String,
        required: [true, 'inserisci il tuo indirizzo']
    },
    city: {
        type:String,
        required:[true, "inserisci la città"]
    },
    country:{
        type: String,
        required:[true, "inserisci lo stato"]
    } ,
    zipcode: {
        type: String,
        required:[true, "inserisci la nazione"]
    },
    numberuser: {
        type: String,
        required: [true, "inserisci il tuo numero di telefono!"]
    },
    photo: String,
    role: {
        type: String,
        enum:['user', 'moderator','admin'],
        default: 'user'
    },
    password:{
        type: String,
        required:[true, 'inserisci la password'],
        minlength: 6,
        select: false
    },
    passwordConfirm:{
        type: String,
        required: [true,'conferma la tua password'],
        validate: {
            // this only work on save
            validator: function(el){
                return el ===this.password;
            },
            message: 'le password non sono uguali'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }

});

userSchema.pre(/^find/ , function(next){
   // user deleted won't be more visible 
   this.find({active: {$ne: false}});
   next();
});

userSchema.pre('save', async function(next){
    // only run this function if password was actually modified
    if(!this.isModified('password')) return ;
  
    this.password =  await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;

    next();
});

userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next();
    // i set one second less because the DB is slower than jwT creation
    //like that i will be sure thaT  JWTTimestamp <passwordChangedAt 
    // in changedPasswordAfter method

    this.passwordChangedAt = Date.now() - 1000;
    
    next();

});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    console.log(candidatePassword, userPassword)
    return await bcrypt.compare(candidatePassword, userPassword);
};


//called by protect
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);  

        return JWTTimestamp < changedTimeStamp;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;


    return resetToken;
};



const User = mongoose.model('User', userSchema);

module.exports = User;