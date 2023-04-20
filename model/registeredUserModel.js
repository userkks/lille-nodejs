const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: String,
    displayName: String,
    email: String,
    picture: String,
    firstName: String,
    lastName: String,
    pictureList: [],
    emailList: [],
    userName: {             // this is used as root path
        default: "",
        type: String
    }

});

module.exports = mongoose.model('registeredUser', userSchema);