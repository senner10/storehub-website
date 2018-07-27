const mongoose = require("mongoose");
var Mixed = mongoose.Schema.Types.Mixed;

var base = require("./baseObject").clone();

base.add({
    meta : Mixed
});

var model = mongoose.model('Image', base);

module.exports = model;