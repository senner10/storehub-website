const mongoose = require("mongoose");
var Mixed = mongoose.Schema.Types.Mixed;

var base = require("./baseObject").clone();

base.add({
    description : String,
    link : String
});

var model = mongoose.model('Alert', base);

module.exports = model;