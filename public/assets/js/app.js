// server.js

// call required packages
var config = require('./config'),
    path = require('path'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    express = require('express'),
    app = express();

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

// public/app/app.js

angular.module('photosApp', [
    'app.routes',
    'photoController',
    'photoService'
]);

// public/app/app.routes.js

angular.module('app.routes', ['ngRoute'])

    .config(function($routeProvider, $locationProvider) {
        $routeProvider

            .when('/', {
                templateUrl: 'app/photos/views/all.html',
                controller: 'photoController',
                controllerAs: 'photo'
            })

            .when('/photos/:photo_id', {
                templateUrl: 'app/photos/views/single.html',
                controller: 'photoViewController',
                controllerAs: 'photo'
            });

        // get rid of the hash in the URL
        $locationProvider.html5Mode(true);
    });

// public/app/components/photos/photoController.js

angular.module('photoController', ['photoService'])

    .controller('photoController', function(Photo) {
        var vm = this;

        // set a processing variable to show loading things
        vm.processing = true;

        // grab all photos at page load
        Photo.all()
            .success(function(data) {
                vm.processing = false;

                // bind the photos that came back
                vm.photos = data;
            });
    })

    .controller('photoViewController', function($routeParams, Photo) {
        var vm = this;

        Photo.get($routeParams.photo_id)
            .success(function(data) {
                vm.photoData = data;
            });
    });

angular.module('photoService', [])

    .factory('Photo', function($http) {
        // create a new object
        var photoFactory = {};

        // get a single photo
        photoFactory.get = function(id) {
            return $http.get('/api/photos/' + id);
        };

        // get all photos
        photoFactory.all = function() {
            return $http.get('/api/photos');
        };

        // create a photo
        photoFactory.create = function(photoData) {
            return $http.post('/api/photos', photoData);
        };

        // update a photo
        photoFactory.update = function(id, photoData) {
            return $http.put('/api/photos/' + id, photoData);
        };

        // delete a photo
        photoFactory.delete = function(id) {
            return $http.delete('/api/photos/' + id);
        };

        return photoFactory;
    });


