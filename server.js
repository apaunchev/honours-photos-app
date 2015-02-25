// server.js

// call required packages
var config = require('./config');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var express = require('express');
var app = express();

// use body-parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure app to handle CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to database
mongoose.connect(config.database);

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
