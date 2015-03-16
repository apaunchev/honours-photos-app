// public/app/components/users/userController.js

angular.module('userController', ['userService'])

    // user controller for the main page
    // inject the User factory
    .controller('userController', function(User) {
        var vm = this;

        vm.processing = true;

        // grab all the users at page load
        User.all()
            .success(function(data) {
                vm.processing = false;
                vm.users = data;
            });
    })

    .controller('userPhotosController', function($scope, $routeParams, User) {
        var vm = this;

        vm.canEdit = false;
        vm.processing = true;

        User.get($routeParams.user_id)
            .success(function(data) {
                vm.user = data;

                if (vm.user._id == $scope.auth.user.id)
                    vm.canEdit = true;

                User.photos($routeParams.user_id)
                    .success(function(data) {
                        vm.processing = false;
                        vm.photos = data;
                    });
            });
    });
