// app/models/photo.js

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// define photo schema
var PhotoSchema = new Schema({
    _user:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    url:     { type: String, required: true, index: { unique: true } },
    caption: String
});

module.exports = mongoose.model('Photo', PhotoSchema);
