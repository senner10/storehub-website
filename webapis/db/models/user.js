const mongoose = require("mongoose");
var base = require("./baseObject").clone();

base.add({
    email : {type: String, required: true, unique: true},
    password : String,
    apps : Array,
    expiration_time : Number,
    stripe_token : String,
    plan_id : String,
    customer_id : String
});

var model = mongoose.model('User', base);

module.exports = model;