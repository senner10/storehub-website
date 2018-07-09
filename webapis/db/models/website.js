const mongoose = require("mongoose");
var base = require("./baseObject").clone();
var Mixed = mongoose.Schema.Types.Mixed;

base.add({
    origins: Mixed,
    secret : String
});

var model = mongoose.model('api', base);

module.exports = model;