angular.module('app', [
    'app.routes',
    'auth',
    'photos',
    'users'
])
    .config(function($httpProvider) {
        // attach the auth interceptor to all http requests
        $httpProvider.interceptors.push('AuthInterceptor');
    });
