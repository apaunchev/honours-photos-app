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
