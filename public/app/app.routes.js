angular.module('app.routes', ['ngRoute'])

    .config(function($routeProvider, $locationProvider) {
        $routeProvider

            .when('/', {
                templateUrl: '/app/home.html',
                controller: 'authController',
                controllerAs: 'auth'
            })

            .when('/login', {
                templateUrl: '/app/auth/login.html',
                controller: 'authController',
                controllerAs: 'auth'
            })

            .when('/photos', {
                templateUrl: '/app/photos/all.html',
                controller: 'photoController',
                controllerAs: 'photo'
            })

            .when('/photos/add', {
                templateUrl: '/app/photos/manage.html',
                controller: 'photoAddController',
                controllerAs: 'photo'
            })

            .when('/photos/:photo_id', {
                templateUrl: '/app/photos/single.html',
                controller: 'photoViewController',
                controllerAs: 'photo'
            })

            .when('/photos/:photo_id/edit', {
                templateUrl: '/app/photos/manage.html',
                controller: 'photoEditController',
                controllerAs: 'photo'
            })

            .when('/users', {
                templateUrl: '/app/users/all.html',
                controller: 'userController',
                controllerAs: 'user'
            })

            .when('/users/:user_id', {
                templateUrl: '/app/users/single.html',
                controller: 'userPhotosController',
                controllerAs: 'user'
            });

        // get rid of the hash in the URL
        $locationProvider.html5Mode(true);
    });
