// app/routes/api.js

var User = require('../models/user'),
    Photo = require('../models/photo');

module.exports = function(app, express) {
    var apiRouter = express.Router();

    // test route to see if API is working
    apiRouter.get('/', function(req, res) {
        res.json({ message: 'Hello world.' });
    });

    // API: /users
    apiRouter.route('/users')

        // get all users
        .get(function(req, res) {
            User.find(function(err, users) {
                if (err) res.send(err);

                res.json(users);
            });
        })

        // create a user
        .post(function(req, res) {
            var user = new User();
            user.username = req.body.username;
            user.password = req.body.password;

            user.save(function(err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000)
                        return res.json({ success: false, message: 'A user with that username already exists.' });
                    else
                        return res.send(err);
                }

                res.json({ message: 'User created.' });
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

        // update the user with that id
        .put(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err) res.send(err);

                // update user's info only if it is new
                if (req.body.username) user.username = req.body.username;
                if (req.body.password) user.password = req.body.password;

                user.save(function(err) {
                    if (err) {
                        // duplicate entry
                        if (err.code == 11000)
                            return res.json({ success: false, message: 'A user with that username already exists.' });
                        else
                            return res.send(err);
                    }

                    res.json({ message: 'User updated.' });
                });
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

    return apiRouter;
};
