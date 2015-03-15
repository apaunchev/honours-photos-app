// public/app/users/userService.js

angular.module('userService', [])

    .factory('User', function($http) {
        // create a new object
        var userFactory = {};

        // get a single user
        userFactory.get = function(id) {
            return $http.get('/api/users/' + id);
        };

        // get all users
        userFactory.all = function() {
            return $http.get('/api/users');
        };

        // get all photos by user
        userFactory.photos = function(id) {
            return $http.get('/api/users/' + id + '/photos');
        };

        // return our entire userFactory object
        return userFactory;
    });
