const mongoose = require("mongoose");
var base = require("./baseObject").clone();

base.add({
    email : {type: String, required: true, unique: true},
    password : String,
    apps : Array,
    expirationTime : Number,
    stripe_token : String
});

var model = mongoose.model('User', base);

module.exports = model;