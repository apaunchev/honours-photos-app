// app/routes/api.js

var config = require('../../config');
var User = require('../models/user');

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
            console.log(req);
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

                res.json({ success: true, message: 'User created.' });
            });
        });

    return apiRouter;
};
