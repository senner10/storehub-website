const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var base = require("./baseObject").clone();

base.add({
    type : Number,
    counter : Number,
    product : Schema.ObjectId,
    date : Date
});

var model = mongoose.model('Analytic', base);

module.exports = model;