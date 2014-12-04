var mongoose = require('mongoose');


//Schema
var channelSchema = mongoose.Schema({
        users        : String,
        password     : String
});

// create the model for channels and expose it to our app
module.exports = mongoose.model('Channels', channelSchema);