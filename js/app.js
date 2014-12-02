'use strict';

//Declare app and dependencies
angular.module('facilityReg', [
    'ngRoute',
    'facilityReg.services',
    'facilityReg.controllers',
    'uiGmapgoogle-maps'
]).
config(['$routeProvider', function ($routeProvider, RestangularProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html',
      controller: 'homeController' });

    $routeProvider.when('/facilities', {templateUrl: 'partials/facilities.html',
    controller: 'facilitiesController'});

    $routeProvider.when('/location', {templateUrl: 'partials/location.html',
    controller: 'locationController'});

    $routeProvider.otherwise({redirectTo: '/home'});
    }]);
