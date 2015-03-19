angular.module('photos', ['services.photos', 'services.comments'])

    .controller('photoController', function($scope, Photo) {
        $scope.processing = true;

        Photo.all()
            .success(function(data) {
                $scope.processing = false;
                $scope.photos = data;
            });
    })

    .controller('photoViewController', function($scope, $route, $routeParams, Photo, User, Comment) {
        $scope.canEditPhoto = false;

        // get the photo
        Photo.get($routeParams.photo_id)
            .success(function(data) {
                $scope.photo = data;

                // get the photo's user
                User.get($scope.photo._user)
                    .success(function(data) {
                        $scope.user = data;

                        if ($scope.user._id == $scope.loggedUser.id)
                            $scope.canEditPhoto = true;
                    });

                // get the photo's comments
                Photo.comments($routeParams.photo_id)
                    .success(function(data) {
                        $scope.comments = data;
                    });
            });

        $scope.saveComment = function() {
            $scope.processing = true;
            $scope.commentData._user = $scope.loggedUser.id;
            $scope.commentData._photo = $scope.photo._id;

            Comment.create($scope.commentData)
                .success(function(data) {
                    // get the comments again to update the view
                    Photo.comments($routeParams.photo_id)
                        .success(function(data) {
                            $scope.processing = false;
                            $scope.commentData = {};
                            $scope.comments = data;
                        });
                });
        };
    })

    .controller('photoAddController', function($scope, $location, Photo) {
        $scope.savePhoto = function() {
            $scope.processing = true;
            $scope.photoData._user = $scope.loggedUser.id;

            Photo.create($scope.photoData)
                .success(function(data) {
                    $scope.processing = false;
                    $location.path('/users/' + $scope.loggedUser.id);
                });
        };
    })

    .controller('photoEditController', function($scope, $routeParams, $location, Photo) {
        Photo.get($routeParams.photo_id)
            .success(function(data) {
                $scope.photoData = data;
            });

        $scope.updatePhoto = function() {
            $scope.processing = true;
            $scope.photoData._user = $scope.loggedUser.id;

            Photo.update($routeParams.photo_id, $scope.photoData)
                .success(function(data) {
                    $scope.processing = false;
                    $location.path('/photos/' + $scope.photoData._id);
                });
        };
    });
