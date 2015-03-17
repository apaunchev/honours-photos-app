var mongoose = require('mongoose'),
    timestamp = require('mongoose-timestamp'),
    Schema = mongoose.Schema;

// define photo schema
var PhotoSchema = new Schema({
    _user:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    url:     { type: String, required: true, index: { unique: true } },
    caption: String
});

PhotoSchema.plugin(timestamp);

module.exports = mongoose.model('Photo', PhotoSchema);
