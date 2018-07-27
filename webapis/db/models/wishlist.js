const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var base = require("./baseObject").clone();

base.add({
    image: String,
    owner: Schema.ObjectId, // user this item belongs to
    item: Schema.ObjectId
});

var model = mongoose.model('Wishlist', base);

module.exports = model;