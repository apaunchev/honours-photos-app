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

// route to send index.html
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/index.html'));
});

// start the server
app.listen(config.port);
console.log('Magic happens on http://localhost:' + config.port + ' ...');
