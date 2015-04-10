angular.module('photos', ['services.photos', 'services.comments'])

    .controller('photoController', function($scope, Photo) {
        Photo.all()
            .success(function(data) {
                $scope.photos = data;
            });
    })

    .controller('photoViewController', function($scope, $route, $routeParams, $location, Photo, User, Comment) {
        $scope.isOwner = false;
        $scope.error = '';

        // get the photo
        Photo.get($routeParams.photo_id)
            .success(function(data) {
                $scope.photo = data;

                // get the photo's user
                User.get($scope.photo._user)
                    .success(function(data) {
                        $scope.user = data;

                        if ($scope.user._id == $scope.loggedUser.id)
                            $scope.isOwner = true;
                    });

                // get the photo's comments
                Photo.comments($routeParams.photo_id)
                    .success(function(data) {
                        $scope.comments = data;
                        $scope.comments.user = [];

                        // get info for comment owners
                        angular.forEach($scope.comments, function(comment, i) {
                            comment.isOwner = false;

                            User.get(comment._user)
                                .success(function(data) {
                                    if (comment._user == $scope.loggedUser.id)
                                        comment.isOwner = true;

                                    $scope.comments[i].user = data;
                                });
                        });
                    });
            })
            .error(function(status) {
                $scope.error = status.message;
            });

        $scope.deletePhoto = function(id) {
            // if photo has comments, delete them first
            if ($scope.comments.length > 0) {
                angular.forEach($scope.comments, function(comment, i) {
                    Comment.delete($scope.comments[i]._id);
                });
            }

            Photo.delete(id)
                .success(function(data) {
                    $location.path('/users/' + $scope.loggedUser.id);
                });
        };

        $scope.saveComment = function() {
            $scope.error = '';

            if ($scope.commentData) {
                $scope.commentData._user = $scope.loggedUser.id;
                $scope.commentData._photo = $scope.photo._id;
            }

            Comment.create($scope.commentData)
                .success(function(data) {
                    // get the comments again to update the view
                    Photo.comments($routeParams.photo_id)
                        .success(function(data) {
                            $scope.commentData = {};
                            $scope.comments = data;
                            $scope.comments.user = [];

                            // get info for comment owners
                            angular.forEach($scope.comments, function(comment, i) {
                                comment.isOwner = false;

                                User.get(comment._user)
                                    .success(function(data) {
                                        if (comment._user == $scope.loggedUser.id)
                                            comment.isOwner = true;

                                        $scope.comments[i].user = data;
                                    });
                            });
                        });
                })
                .error(function(status) {
                    $scope.error = status.message;
                });
        };

        $scope.deleteComment = function(id) {
            Comment.delete(id)
                .success(function(data) {
                    // get the comments again to update the view
                    Photo.comments($routeParams.photo_id)
                        .success(function(data) {
                            $scope.commentData = {};
                            $scope.comments = data;
                            $scope.comments.user = [];

                            // get info for comment owners
                            angular.forEach($scope.comments, function(comment, i) {
                                comment.isOwner = false;

                                User.get(comment._user)
                                    .success(function(data) {
                                        if (comment._user == $scope.loggedUser.id)
                                            comment.isOwner = true;

                                        $scope.comments[i].user = data;
                                    });
                            });
                        });
                });
        };
    })

    .controller('photoAddController', function($scope, $location, Photo) {
        $scope.type = 'add';
        $scope.error = '';

        $scope.savePhoto = function() {
            if ($scope.photoData)
                $scope.photoData._user = $scope.loggedUser.id;

            Photo.create($scope.photoData)
                .success(function(data) {
                    if (data.success)
                        $location.path('/users/' + $scope.loggedUser.id);
                })
                .error(function(status) {
                    $scope.error = status.message;
                });
        };
})

    .controller('photoEditController', function($scope, $routeParams, $location, Photo) {
        $scope.type = 'edit';
        $scope.error = '';
        $scope.updateError = '';

        Photo.get($routeParams.photo_id)
            .success(function(data) {
                $scope.photoData = data;
            })
            .error(function(status) {
                $scope.error = status.message;
            });

        $scope.savePhoto = function() {
            if ($scope.photoData)
                $scope.photoData._user = $scope.loggedUser.id;

            Photo.update($routeParams.photo_id, $scope.photoData)
                .success(function(data) {
                    if (data.success)
                        $location.path('/photos/' + $scope.photoData._id);
                })
                .error(function(status) {
                    $scope.updateError = status.message;
                });
        };
    });
