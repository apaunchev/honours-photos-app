angular.module('photos', ['services.photos'])

    .controller('photoController', function(Photo) {
        var vm = this;

        vm.processing = true;

        Photo.all()
            .success(function(data) {
                vm.processing = false;
                vm.photos = data;
            });
    })

    .controller('photoViewController', function($routeParams, Photo, User) {
        var vm = this;

        Photo.get($routeParams.photo_id)
            .success(function(data) {
                vm.photo = data;

                User.get(vm.photo._user)
                    .success(function(data) {
                        vm.user = data;
                    });
            });
    })

    .controller('photoAddController', function($scope, $location, Photo) {
        var vm = this;

        vm.savePhoto = function() {
            vm.processing = true;
            vm.photoData._user = $scope.auth.user.id;

            Photo.create(vm.photoData)
                .success(function(data) {
                    vm.processing = false;
                    $location.path('/users/' + $scope.auth.user.id + '/photos');
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
                    $location.path('/users/' + $scope.auth.user.id + '/photos');
                });
        };
    });
