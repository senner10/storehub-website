const mongoose = require("mongoose");
var Mixed = mongoose.Schema.Types.Mixed;

var base = require("./baseObject").clone();

base.add({
    apiKey : String
});

var model = mongoose.model('Mailchimp', base);

module.exports = model;