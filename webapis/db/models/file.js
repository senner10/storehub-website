var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BSchema = new Schema({
    created: Date,
    data: Buffer,
    owner: Schema.ObjectId,
    mimetype: String,
    name: String
})

module.exports = mongoose.model('file', BSchema); //show aka event