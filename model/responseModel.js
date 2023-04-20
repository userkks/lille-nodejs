const mongoose = require('mongoose');

const responseItemSchema = new mongoose.Schema({
    mainKey: String,    // the key or api registered name
    responseString: String    // string representation of json object
});

module.exports = mongoose.model('response', responseItemSchema);