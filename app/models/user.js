var mongoose = require('mongoose'),
    timestamp = require('mongoose-timestamp'),
    Schema = mongoose.Schema;

var bcrypt = require('bcrypt-nodejs');

// define user schema
var UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true, select: false }
});

UserSchema.plugin(timestamp);

// hash the password before saving a user
UserSchema.pre('save', function(next) {
    var user = this;

    // hash the password only if it has been changed or the user is new
    if (!user.isModified('password')) return next();

    // generate the hash
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);

        // change the password to the hashed version
        user.password = hash;

        next();
    });
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
    var user = this;

    return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);
