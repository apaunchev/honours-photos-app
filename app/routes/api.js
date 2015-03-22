// app/routes/api.js

var config = require('../../config'),
    secret = config.secret,
    jwt = require('jsonwebtoken'),
    User = require('../models/user'),
    Photo = require('../models/photo'),
    Comment = require('../models/comment');

module.exports = function(app, express) {
    var apiRouter = express.Router();

    // API: /signup
    apiRouter.post('/signup', function(req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err) {
            if (err) {
                // duplicate entry
                if (err.code == 11000)
                    return res.json({
                        success: false,
                        message: 'A user with that username already exists.'
                    });
                else
                    return res.send(err);
            }

            res.json({
                success: true,
                message: 'User created.'
            });
        });
    });

    // API: /authenticate
    apiRouter.post('/authenticate', function(req, res) {
        // find the user
        User.findOne({
            username: req.body.username,
        }).select('username password').exec(function(err, user) {
            if (err) throw err;

            // if no user with that username was found
            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed: user not found.'
                });
            } else if (user) {
                // user found; check if password matches
                var validPassword = user.comparePassword(req.body.password);

                if (!validPassword) {
                    res.json({
                        success: false,
                        message: 'Authentication failed: wrong password.'
                    });
                } else {
                    // user found and password matches

                    // create a token
                    var token = jwt.sign({
                        id: user._id,
                        username: user.username
                    }, secret, {
                        expiresInMinutes: 1440 // expires in 24 hours
                    });

                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            }
        });
    });

    // route middleware to verify a token
    apiRouter.use(function(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.params.token || req.headers['x-access-token'];

        // decode token
        if (token) {
            // verify secret and check expiration
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;

                    next();
                }
            });
        } else {
            // if there is no token
            // return an HTTP response of 403 (access forbidden) and an error message
            res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    });

    // API: /users
    apiRouter.route('/users')

        // get all users
        .get(function(req, res) {
            User.find(function(err, users) {
                if (err) res.send(err);

                res.json(users);
            });
        });

    // API: /users/:user_id
    apiRouter.route('/users/:user_id')

        // get the user with that id
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err) res.send(err);

                res.json(user);
            });
        })

        // delete the user with that id
        .delete(function(req, res) {
            User.remove({ _id: req.params.user_id }, function(err, user) {
                if (err) res.send(err);

                res.json({ message: 'User deleted.' });
            });
        });

    // API: /users/:user_id/photos
    apiRouter.route('/users/:user_id/photos')

        // get the photos of the user with that id
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err) res.send(err);

                Photo.find({ _user: user._id }, function(err, photos) {
                    if (err) res.send(err);

                    res.json(photos);
                });
            });
        });

    // API: /users/:user_id/photos/latest
    apiRouter.route('/users/:user_id/photos/latest')

        // get the 4 latest photos of the user with that id
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err) res.send(err);

                Photo.find({ _user: user._id }).sort('-createdAt').limit(4).exec(function(err, photos) {
                    if (err) res.send(err);

                    res.json(photos);
                });
            });
        });

    // API: /me
    // endpoint to get information about the logged in user
    apiRouter.get('/me', function(req, res) {
        res.send(req.decoded);
    });

    // API: /photos
    apiRouter.route('/photos')

        // get all photos
        .get(function(req, res) {
            Photo.find(function(err, photos) {
                if (err) res.send(err);

                res.json(photos);
            });
        })

        // create a photo
        .post(function(req, res) {
            var photo = new Photo();
            photo._user = req.body._user;
            photo.url = req.body.url;
            photo.caption = req.body.caption;

            photo.save(function(err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000)
                        return res.json({ success: false, message: 'A photo with that URL already exists.' });
                    else
                        return res.send(err);
                }

                res.json({ message: 'Photo created.' });
            });
        });

    // API: /photos/:photo_id
    apiRouter.route('/photos/:photo_id')

        // get the photo with that id
        .get(function(req, res) {
            Photo.findById(req.params.photo_id, function(err, photo) {
                if (err) res.send(err);

                res.json(photo);
            });
        })

        // update the photo with that id
        .put(function(req, res) {
            Photo.findById(req.params.photo_id, function(err, photo) {
                if (err) res.send(err);

                // update photo's info only if it is new
                if (req.body.url) photo.url = req.body.url;
                if (req.body.caption) photo.caption = req.body.caption;

                photo.save(function(err) {
                    if (err) {
                        // duplicate entry
                        if (err.code == 11000)
                            return res.json({ success: false, message: 'A photo with that URL already exists.' });
                        else
                            return res.send(err);
                    }

                    res.json({ message: 'Photo updated.' });
                });
            });
        })

        // delete the photo with that id
        .delete(function(req, res) {
            Photo.remove({ _id: req.params.photo_id }, function(err, photo) {
                if (err) res.send(err);

                res.json({ message: 'Photo deleted.' });
            });
        });

    // API: /photos/:photo_id/comments
    apiRouter.route('/photos/:photo_id/comments')

        // get the comments of the photo with that id
        .get(function(req, res) {
            Photo.findById(req.params.photo_id, function(err, photo) {
                if (err) res.send(err);

                Comment.find({ _photo: photo._id }, function(err, comments) {
                    if (err) res.send(err);

                    res.json(comments);
                });
            });
        });

    // API: /comments
    apiRouter.route('/comments')

        // create a comment
        .post(function(req, res) {
            var comment = new Comment();
            comment._user = req.body._user;
            comment._photo = req.body._photo;
            comment.content = req.body.content;

            comment.save(function(err) {
                if (err) return res.send(err);

                res.json({ message: 'Comment created.' });
            });
        });

    // API: /comments/:comment_id
    apiRouter.route('/comments/:comment_id')

        // get the comment with that id
        .get(function(req, res) {
            Comment.findById(req.params.comment_id, function(err, comment) {
                if (err) res.send(err);

                res.json(comment);
            });
        })

        // delete the comment with that id
        .delete(function(req, res) {
            Comment.remove({ _id: req.params.comment_id }, function(err, comment) {
                if (err) res.send(err);

                res.json({ message: 'Comment deleted.' });
            });
        });

    return apiRouter;
};
