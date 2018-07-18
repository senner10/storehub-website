const mongoose = require("mongoose");

var Mixed = mongoose.Schema.Types.Mixed;


var base = require("./baseObject").clone();

base.add({
    start_date: Date,
    end_date: Date,
    description: String,
    meta: Mixed,
    rsvp : Boolean,
    images : Array,
    list_id : String // mailchimp list id
});

var model = mongoose.model('Event', base);

module.exports = model;