var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var baseSchema = new Schema({
    created_at: Date,
    updated_at: Date,
    name : String,
    owner : Schema.ObjectId,
    live : Boolean
})

module.exports = baseSchema;