// public/app/app.routes.js

angular.module('app.routes', ['ngRoute'])

    .config(function($routeProvider, $locationProvider) {
        $routeProvider

            .when('/', {
                templateUrl: '/app/photos/views/all.html',
                controller: 'photoController',
                controllerAs: 'photo'
            })

            .when('/login', {
                templateUrl: '/app/auth/views/login.html',
                controller: 'authController',
                controllerAs: 'auth'
            })

            .when('/photos', {
                templateUrl: '/app/photos/views/all.html',
                controller: 'photoController',
                controllerAs: 'photo'
            })

            .when('/photos/create', {
                templateUrl: '/app/photos/views/single.html',
                controller: 'photoCreateController',
                controllerAs: 'photo'
            })

            .when('/photos/:photo_id', {
                templateUrl: '/app/photos/views/single.html',
                controller: 'photoViewController',
                controllerAs: 'photo'
            })

            .when('/users', {
                templateUrl: '/app/users/views/all.html',
                controller: 'userController',
                controllerAs: 'user'
            })

            .when('/users/:user_id/photos', {
                templateUrl: '/app/users/views/photos.html',
                controller: 'userPhotosController',
                controllerAs: 'user'
            });

        // get rid of the hash in the URL
        $locationProvider.html5Mode(true);
    });
