angular.module('auth', ['services.auth'])

    .controller('authController', function($rootScope, $scope, $location, Auth) {
        // get info if a user is logged in
        $scope.loggedIn = Auth.isLoggedIn();

        // check to see if a user is logged in on every request
        $rootScope.$on('$routeChangeStart', function() {
            $scope.loggedIn = Auth.isLoggedIn();

            // get user information on route change
            Auth.getUser()
                .then(function(data) {
                    $scope.loggedUser = data.data;
                });
        });

        // function to handle login form
        $scope.doLogin = function() {
            // set a processing variable to show loading things
            $scope.processing = true;

            // clear the error
            $scope.error = '';

            Auth.login($scope.loginData.username, $scope.loginData.password)
                .success(function(data) {
                    $scope.processing = false;

                    // if a user successfully logs in, redirect to users page
                    if (data.success)
                        $location.path('/photos');
                    else
                        $scope.error = data.message;
                });
        };

        // function to handle logging out
        $scope.doLogout = function() {
            Auth.logout();
            $location.path('/');
        };
    });
