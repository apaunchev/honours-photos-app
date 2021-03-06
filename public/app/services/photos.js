angular.module('services.photos', [])

    .factory('Photo', function($http) {
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

        // get photo's comments
        photoFactory.comments = function(id) {
            return $http.get('/api/photos/' + id + '/comments');
        };

        return photoFactory;
    });
