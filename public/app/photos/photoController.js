// public/app/components/photos/photoController.js

angular.module('photoController', ['photoService'])

    .controller('photoController', function(Photo) {
        var vm = this;

        vm.processing = true;

        Photo.all()
            .success(function(data) {
                vm.processing = false;
                vm.photos = data;
            });
    })

    .controller('photoViewController', function($routeParams, Photo) {
        var vm = this;

        Photo.get($routeParams.photo_id)
            .success(function(data) {
                vm.photo = data;
            });
    })

    .controller('photoAddController', function($scope, $location, Auth, Photo) {
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
    });
