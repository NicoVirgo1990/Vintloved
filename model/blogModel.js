const mongoose = require('mongoose');


const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'Un blog deve avere un titolo']
    },
    text: {
        type: String,
        required: [true, 'Un blog deve avere un testo']
    },
    Date: {
        type: Date,
        default: Date.now()
    },
    models:[{      
        type: mongoose.Schema.ObjectId,
        ref: 'Model'
     }
    ]
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});


const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;

