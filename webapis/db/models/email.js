const mongoose = require("mongoose");
var base = require("./baseObject").clone();

base.add({
    email : String
});

var model = mongoose.model('Email', base);

module.exports = model;