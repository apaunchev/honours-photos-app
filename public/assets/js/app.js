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

// public/app/photos/photoService.js

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
>>>>>>> ui


