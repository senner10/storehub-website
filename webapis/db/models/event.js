const mongoose = require("mongoose");

var Mixed = mongoose.Schema.Types.Mixed;


var base = require("./baseObject").clone();

base.add({
    start_date: Date,
    end_date: Date,
    description: String,
    meta: Mixed,
    rsvp : Boolean
});

var model = mongoose.model('Event', base);

module.exports = model;