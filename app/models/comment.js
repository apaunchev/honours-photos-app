var mongoose = require('mongoose'),
    timestamp = require('mongoose-timestamp'),
    Schema = mongoose.Schema;

// define comment schema
var CommentSchema = new Schema({
    _user:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    _photo:  { type: Schema.Types.ObjectId, ref: 'Photo', required: true },
    content: { type: String, required: true }
});

CommentSchema.plugin(timestamp);

module.exports = mongoose.model('Comment', CommentSchema);
