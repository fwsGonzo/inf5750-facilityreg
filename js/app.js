'use strict';

//Declare app and dependencies
angular.module('facilityReg', [
    'ngRoute',
    'facilityReg.services',
    'facilityReg.controllers'
]).
config(['$routeProvider', function ($routeProvider, RestangularProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html',
      controller: 'homeController' });

    $routeProvider.when('/facilities', {templateUrl: 'partials/facilities.html',
    controller: 'facilitiesController'});

    $routeProvider.otherwise({redirectTo: '/home'});
    }]);
