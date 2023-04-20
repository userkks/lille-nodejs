const mongoose = require('mongoose');

const userPostApiModel = mongoose.Schema({
    apiKey: String,
    userName: String,
    dataArray: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('userPostApi', userPostApiModel);