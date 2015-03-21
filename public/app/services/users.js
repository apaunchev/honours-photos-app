angular.module('services.users', [])

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

        // create a user
        userFactory.create = function(userData) {
            return $http.post('/api/users', userData);
        };

        // get all photos by user
        userFactory.allPhotos = function(id) {
            return $http.get('/api/users/' + id + '/photos');
        };

        // get the 4 latest photos by user
        userFactory.latestPhotos = function(id) {
            return $http.get('/api/users/' + id + '/photos/latest');
        };

        // return our entire userFactory object
        return userFactory;
    });
