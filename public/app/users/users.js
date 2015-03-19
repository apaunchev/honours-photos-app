angular.module('users', ['services.users'])

    .controller('userController', function($scope, User) {
        // var vm = this;

        $scope.processing = true;

        User.all()
            .success(function(data) {

                $scope.users = data;
                $scope.users.photos = [];

                angular.forEach($scope.users, function(user, i) {
                    User.latestPhotos(user._id)
                        .success(function(data) {
                            $scope.processing = false;
                            $scope.users[i].photos = data;
                        });
                });
            });
    })

    .controller('userPhotosController', function($scope, $routeParams, User, Photo) {
        var vm = this;

        vm.canEdit = false;

        User.get($routeParams.user_id)
            .success(function(data) {
                vm.user = data;

                if (vm.user._id == $scope.auth.user.id)
                    vm.canEdit = true;

                User.allPhotos($routeParams.user_id)
                    .success(function(data) {
                        vm.photos = data;
                    });
            });

        vm.deletePhoto = function(id) {
            vm.processing = true;

            Photo.delete(id)
                .success(function(data) {
                    // get the user's photos again to update the view
                    User.allPhotos($routeParams.user_id)
                        .success(function(data) {
                            vm.processing = false;
                            vm.photos = data;
                        });
                });
        };
    });
