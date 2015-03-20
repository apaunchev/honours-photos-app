angular.module('services.comments', [])

    .factory('Comment', function($http) {
        var commentFactory = {};

        // get a comment
        commentFactory.get = function(id) {
            return $http.get('/api/comments/' + id);
        };

        // create a comment
        commentFactory.create = function(commentData) {
            return $http.post('/api/comments', commentData);
        };

        // delete a comment
        commentFactory.delete = function(id) {
            return $http.delete('/api/comments/' + id);
        };

        return commentFactory;
    });
