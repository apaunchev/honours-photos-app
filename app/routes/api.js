// app/routes/api.js

var config = require('../../config');
var User = require('../models/user');

module.exports = function(app, express) {
    var apiRouter = express.Router();

    // test route to see if API is working
    apiRouter.get('/', function(req, res) {
        res.json({ message: 'Hello world.' });
    });

    return apiRouter;
};
