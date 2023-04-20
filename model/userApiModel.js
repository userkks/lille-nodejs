const mongoose = require('mongoose');

const userApiSchema = new mongoose.Schema({
    userName: String,
    responseString: String,
    mainKey: String,
    apiType: {
        default: "GET",
        type: String
    },
    hitCount: {
        default: 0,
        type: Number
    }
});

module.exports = new mongoose.model('userApi', userApiSchema)