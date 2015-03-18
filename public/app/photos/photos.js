angular.module('photos', ['services.photos', 'services.comments'])

    .controller('photoController', function(Photo) {
        var vm = this;

        vm.processing = true;

        Photo.all()
            .success(function(data) {
                vm.processing = false;
                vm.photos = data;
            });
    })

    .controller('photoViewController', function($scope, $route, $routeParams, Photo, User, Comment) {
        var vm = this;

        vm.canEditPhoto = false;

        // get the photo
        Photo.get($routeParams.photo_id)
            .success(function(data) {
                vm.photo = data;

                // get the photo's user
                User.get(vm.photo._user)
                    .success(function(data) {
                        vm.user = data;

                        if (vm.user._id == $scope.auth.user.id)
                            vm.canEditPhoto = true;
                    });

                // get the photo's comments
                Photo.getComments($routeParams.photo_id)
                    .success(function(data) {
                        vm.comments = data;
                    });
            });

        vm.saveComment = function() {
            vm.processing = true;
            vm.commentData._user = $scope.auth.user.id;
            vm.commentData._photo = vm.photo._id;

            Comment.create(vm.commentData)
                .success(function(data) {
                    vm.processing = false;
                    $route.reload();
                });
        };
    })

    .controller('photoAddController', function($scope, $location, Photo) {
        var vm = this;

        vm.savePhoto = function() {
            vm.processing = true;
            vm.photoData._user = $scope.auth.user.id;

            Photo.create(vm.photoData)
                .success(function(data) {
                    vm.processing = false;
                    $location.path('/users/' + $scope.auth.user.id);
                });
        };
    })

    .controller('photoEditController', function($routeParams, $scope, $location, Photo) {
        var vm = this;

        Photo.get($routeParams.photo_id)
            .success(function(data) {
                vm.photoData = data;
            });

        vm.updatePhoto = function() {
            vm.processing = true;
            vm.photoData._user = $scope.auth.user.id;

            Photo.update($routeParams.photo_id, vm.photoData)
                .success(function(data) {
                    vm.processing = false;
                    $location.path('/photos/' + vm.photoData._id);
                });
        };
    });
