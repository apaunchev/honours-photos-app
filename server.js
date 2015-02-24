/**
 * SERVER.JS
 */

// call required packages
var config = require('./config');
var path = require('path');
var express = require('express');
var app = express();

// configure public assets folder
app.use(express.static(__dirname + '/public'));

// API routes
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// catch-all route
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/index.html'));
});

// start the server
app.listen(config.port);
console.log('Magic happens on http://localhost:' + config.port + ' ...');
