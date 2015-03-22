angular.module('app', [
    'app.routes',
    'auth',
    'photos',
    'users'
])
    .config(function($httpProvider) {
        // attach the auth interceptor to all http requests
        $httpProvider.interceptors.push('AuthInterceptor');
    })

    .directive('ngConfirmClick', [
        function() {
            return {
                link: function(scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";
                    var clickAction = attr.confirmedClick;

                    element.bind('click', function(event) {
                        if (window.confirm(msg))
                            scope.$eval(clickAction);
                    });
                }
            };
        }
    ]);
