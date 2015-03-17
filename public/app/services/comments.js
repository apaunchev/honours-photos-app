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

        return commentFactory;
    });
