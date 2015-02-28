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
