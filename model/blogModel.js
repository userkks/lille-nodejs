const mongoose = require('mongoose');

const blogModelSchema = new mongoose.Schema(
    {
        title: String,
        header: String,
        mainImage: String,
        gistLine: String,
        content: []
    }
);

// here conent should be in the format of
// [
//     {
//         paragraph: String
//     }
//     or 
//     {
//         image: String,
// description: String
//     }
// ]

module.exports = mongoose.model('blogPost', blogModelSchema);