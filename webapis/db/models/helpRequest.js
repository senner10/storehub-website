const mongoose = require("mongoose");
var base = require("./baseObject").clone();

base.add({
    message: String,
    subject : String
});

var model = mongoose.model('HelpRequest', base);

module.exports = model;