// public/app/app.js

angular.module('photosApp', [
    'app.routes',
    'services.breadcrumbs',
    'authService',
    'authController',
    'userService',
    'userController',
    'photoService',
    'photoController'
])
    .config(function($httpProvider) {
        // attach the auth interceptor to all http requests
        $httpProvider.interceptors.push('AuthInterceptor');
    });
