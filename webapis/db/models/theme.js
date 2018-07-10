const mongoose = require("mongoose");
var base = require("./baseObject").clone();
var Mixed = mongoose.Schema.Types.Mixed;

base.add({
    theme : Mixed
});

var model = mongoose.model('Theme', base);

module.exports = model;