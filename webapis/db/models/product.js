const mongoose = require("mongoose");

var Mixed = mongoose.Schema.Types.Mixed;

var base = require("./baseObject").clone();

base.add({
    price : Number,
    sku : String,
    live : Boolean,
    description : String,
    tags : Array,
    images : Array,
    category : String,
    sub_category : String,
    meta : Mixed
});

var model = mongoose.model('Product', base);

module.exports = model;