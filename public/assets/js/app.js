// public/app/app.js

angular.module('photosApp', [
    'app.routes',
    'authService',
    'authController',
    'userService',
    'userController',
    'photoService',
    'photoController'
]);

// public/app/app.routes.js

angular.module('app.routes', ['ngRoute'])

    .config(function($routeProvider, $locationProvider) {
        $routeProvider

            .when('/', {
                templateUrl: '/app/photos/views/all.html',
                controller: 'photoController',
                controllerAs: 'photo'
            })

            .when('/login', {
                templateUrl: '/app/auth/views/login.html',
                controller: 'authController',
                controllerAs: 'auth'
            })

            .when('/photos', {
                templateUrl: '/app/photos/views/all.html',
                controller: 'photoController',
                controllerAs: 'photo'
            })

            // form to create/edit a new photo
            .when('/photos/create', {
                templateUrl: '/app/photos/views/single.html',
                controller: 'photoCreateController',
                controllerAs: 'photo'
            })

            .when('/photos/:photo_id', {
                templateUrl: '/app/photos/views/single.html',
                controller: 'photoViewController',
                controllerAs: 'photo'
            })

            .when('/users', {
                templateUrl: '/app/users/views/all.html',
                controller: 'userController',
                controllerAs: 'user'
            })

            // form to create/edit a new user
            .when('/users/create', {
                templateUrl: '/app/users/views/single.html',
                controller: 'userCreateController',
                controllerAs: 'user'
            })

            .when('/users/:user_id', {
                templateUrl: '/app/users/views/single.html',
                controller: 'userEditController',
                controllerAs: 'user'
            });

        // get rid of the hash in the URL
        $locationProvider.html5Mode(true);
    });

angular.module('authController', [])

    .controller('authController', function($rootScope, $location, Auth) {
        var vm = this;

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
                        $location.path('/users');
                    else
                        vm.error = data.message;
                });
        };

        // function to handle logging out
        vm.doLogout = function() {
            Auth.logout();
            $location.path('/login');
        };
    });

angular.module('authService', [])

    // auth factory to log in and get information
    // inject $http for communicating with the API
    // inject $q to return promise objects
    // inject AuthToken to manage tokens
    .factory('Auth', function($http, $q, AuthToken) {
        var authFactory = {};

        // handle login
        authFactory.login = function(username, password) {
            // return the promise object and its data
            return $http.post('/api/authenticate', {
                username: username,
                password: password
            }).success(function(data) {
                AuthToken.setToken(data.token);

                return data;
            });
        };

        // handle logout
        authFactory.logout = function() {
            // clear the token
            AuthToken.setToken();
        };

        // check if a user is logged in
        // checks if there is a local token
        authFactory.isLoggedIn = function() {
            if (AuthToken.getToken())
                return true;
            else
                return false;
        };

        // get the logged in user
        authFactory.getUser = function() {
            if (AuthToken.getToken())
                return $http.get('/api/me', { cache: true });
            else
                return $q.reject({ message: 'User has no token.' });
        };

        return authFactory;
    })

    // factory for handling tokens
    // inject $window to store token client-side
    .factory('AuthToken', function($window) {
        var authTokenFactory = {};

        // get the token out of local storage
        authTokenFactory.getToken = function() {
            return $window.localStorage.getItem('token');
        };

        // set or clear the token
        // if a token is passed, set the token
        // if there is no token, clear it from local storage
        authTokenFactory.setToken = function(token) {
            if (token)
                $window.localStorage.setItem('token', token);
            else
                $window.localStorage.removeItem('token');
        };

        return authTokenFactory;
    })

    // application configuration to integrate token into requests
    .factory('AuthInterceptor', function($q, AuthToken) {
        var interceptorFactory = {};

        // happens on all HTTP requests
        interceptorFactory.request = function(config) {
            // grab the token
            var token = AuthToken.getToken();

            // if the token exists, add it to the header as x-access-token
            if (token)
                config.headers['x-access-token'] = token;

            return config;
        };

        // happens on response errors
        interceptorFactory.responseError = function(response) {
            // if our server returns a 403 forbidden response
            if (response.status == 403) {
                AuthToken.setToken();
                $location.path('/login');
            }

            // return the errors from the server as a promise
            return $q.reject(response);
        };

        return interceptorFactory;
    });

// public/app/components/photos/photoController.js

angular.module('photoController', ['photoService'])

    .controller('photoController', function(Photo) {
        var vm = this;

        // set a processing variable to show loading things
        vm.processing = true;

        // grab all photos at page load
        Photo.all()
            .success(function(data) {
                vm.processing = false;

                // bind the photos that came back
                vm.photos = data;
            });
    })

    .controller('photoViewController', function($routeParams, Photo) {
        var vm = this;

        Photo.get($routeParams.photo_id)
            .success(function(data) {
                vm.photoData = data;
            });
    });

// public/app/photos/photoService.js

angular.module('photoService', [])

    .factory('Photo', function($http) {
        // create a new object
        var photoFactory = {};

        // get a single photo
        photoFactory.get = function(id) {
            return $http.get('/api/photos/' + id);
        };

        // get all photos
        photoFactory.all = function() {
            return $http.get('/api/photos');
        };

        // create a photo
        photoFactory.create = function(photoData) {
            return $http.post('/api/photos', photoData);
        };

        // update a photo
        photoFactory.update = function(id, photoData) {
            return $http.put('/api/photos/' + id, photoData);
        };

        // delete a photo
        photoFactory.delete = function(id) {
            return $http.delete('/api/photos/' + id);
        };

        return photoFactory;
    });

angular.module('userController', ['userService'])

    // user controller for the main page
    // inject the User factory
    .controller('userController', function(User) {
        var vm = this;

        // set a processing variable to show loading things
        vm.processing = true;

        // grab all the users at page load
        User.all()
            .success(function(data) {
                // when all the users come back, unset the processing variable
                vm.processing = false;

                // bind the users that came back to vm.users
                vm.users = data;
            });

        // delete user
        vm.deleteUser = function(id) {
            vm.processing = true;

            // accepts the user id as a parameter
            User.delete(id)
                .success(function(data) {
                    // get all users to update the table
                    User.all().
                        success(function(data) {
                            vm.processing = false;
                            vm.users = data;
                        });
                });
        };
    })

    // controller applied to user creation page
    .controller('userCreateController', function(User) {
        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create and edit pages
        vm.type = 'create';

        // function to create user
        vm.saveUser = function() {
            vm.processing = true;

            // clear the message
            vm.message = '';

            // use the create function in the userService
            User.create(vm.userData)
                .success(function(data) {
                    vm.processing = false;

                    // clear the form
                    vm.userData = {};
                    vm.message = data.message;
                });
        };
    })

    // controller applied to user edit page
    .controller('userEditController', function($routeParams, User) {
        var vm = this;

        // variable to hide/show elements of the view
        // differentiates between create and edit pages
        vm.type = 'edit';

        // get the user data for the user you want to edit
        // $routeParams is the way we grab data from the URL
        User.get($routeParams.user_id)
            .success(function(data) {
                vm.userData = data;
            });


        // function to save the user
        vm.saveUser = function() {
            vm.processing = true;
            vm.message = '';

            // call the userService function to update
            User.update($routeParams.user_id, vm.userData)
                .success(function(data) {
                    vm.processing = false;

                    // clear the form
                    vm.userData = {};

                    // bind the message from our API to vm.message
                    vm.message = data.message;
                });
        };
    });

angular.module('userService', [])

    .factory('User', function($http) {
        // create a new object
        var userFactory = {};

        // get a single user
        userFactory.get = function(id) {
            return $http.get('/api/users/' + id);
        };

        // get all users
        userFactory.all = function() {
            return $http.get('/api/users');
        };

        // create a user
        userFactory.create = function(userData) {
            return $http.post('/api/users', userData);
        };

        // update a user
        userFactory.update = function(id, userData) {
            return $http.put('/api/users/' + id, userData);
        };

        // delete a user
        userFactory.delete = function(id) {
            return $http.delete('/api/users/' + id);
        };

        // return our entire userFactory object
        return userFactory;
    });
