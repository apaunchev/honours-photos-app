angular.module('users', ['services.users'])

    .controller('userController', function($scope, User) {
        User.all()
            .success(function(data) {
                $scope.users = data;
                $scope.users.photos = [];

                angular.forEach($scope.users, function(user, i) {
                    User.latestPhotos(user._id)
                        .success(function(data) {
                            $scope.users[i].photos = data;
                        });
                });
            });
    })

    .controller('userPhotosController', function($scope, $routeParams, User, Photo) {
        $scope.isOwner = false;

        User.get($routeParams.user_id)
            .success(function(data) {
                $scope.user = data;

                if ($scope.user._id == $scope.loggedUser.id)
                    $scope.isOwner = true;

                User.allPhotos($routeParams.user_id)
                    .success(function(data) {
                        $scope.photos = data;
                    });
            });

        $scope.deletePhoto = function(id) {
            $scope.processing = true;

            Photo.delete(id)
                .success(function(data) {
                    // get the user's photos again to update the view
                    User.allPhotos($routeParams.user_id)
                        .success(function(data) {
                            $scope.processing = false;
                            $scope.photos = data;
                        });
                });
        };
    });
