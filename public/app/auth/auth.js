angular.module('auth', ['services.auth'])

    .controller('authController', function($rootScope, $scope, $location, $route, Auth) {
        $scope.justSignedUp = false;

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

        $scope.doSignup = function() {
            $scope.error = '';

            if ($scope.signupData) {
                Auth.signup($scope.signupData.username, $scope.signupData.password)
                    .success(function(data) {
                        if (data.success) {
                            $scope.justSignedUp = true;
                            $scope.signupData = {};
                        }
                    })
                    .error(function(status) {
                        $scope.error = status.message;
                    });
            } else {
                $scope.error = 'Please enter a valid username and password.';
            }
        };

        $scope.doLogin = function() {
            $scope.error = '';

            if ($scope.loginData) {
                Auth.login($scope.loginData.username, $scope.loginData.password)
                    .success(function(data) {
                        if (data.success)
                            $location.path('/photos');
                    })
                    .error(function(status) {
                        $scope.error = status.message;
                    });
            } else {
                $scope.error = 'Please enter valid login credentials.';
            }
        };

        $scope.doLogout = function() {
            Auth.logout();

            if ($location.url() != '/')
                $location.path('/');
            else
                $route.reload();
        };
    });
