angular.module('auth', ['services.auth'])

    .controller('authController', function($rootScope, $scope, $location, breadcrumbs, Auth) {
        var vm = this;

        $scope.breadcrumbs = breadcrumbs;

        // get info if a user is logged in
        vm.loggedIn = Auth.isLoggedIn();

        // check to see if a user is logged in on every request
        $rootScope.$on('$routeChangeStart', function() {
            vm.loggedIn = Auth.isLoggedIn();

            // get user information on route change
            Auth.getUser()
                .then(function(data) {
                    vm.user = data.data;
                });
        });

        // function to handle login form
        vm.doLogin = function() {
            // set a processing variable to show loading things
            vm.processing = true;

            // clear the error
            vm.error = '';

            Auth.login(vm.loginData.username, vm.loginData.password)
                .success(function(data) {
                    vm.processing = false;

                    // if a user successfully logs in, redirect to users page
                    if (data.success)
                        $location.path('/photos');
                    else
                        vm.error = data.message;
                });
        };

        // function to handle logging out
        vm.doLogout = function() {
            Auth.logout();
            $location.path('/');
        };
    });