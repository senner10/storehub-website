var mongoose = require('mongoose');

var email = require("./models/email")
var event = require("./models/event")
var image = require("./models/image")
var location = require("./models/location")
var product = require("./models/product")
var website = require("./models/website")


var db = mongoose.connect('mongodb://localhost/test');

var models = [
    event,
    image,
    location,
    product,
    website
];


module.exports = {models : models , db : db};