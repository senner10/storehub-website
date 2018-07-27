const mongoose = require("mongoose");
var Mixed = mongoose.Schema.Types.Mixed;
var base = require("./baseObject").clone();

base.add({
    location : Mixed,
    address : String,
    fence_bounds : Mixed,
    images : Array,
    useFence : Boolean,
    range : Number,
    meta : Mixed
});

var model = mongoose.model('Location', base);

module.exports = model;