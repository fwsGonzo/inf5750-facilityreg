'use strict';

//Declare app and dependencies
angular.module('facilityReg', [
    'ngRoute',
    'facilityReg.services',
    'facilityReg.controllers',
    'uiGmapgoogle-maps',
    'leaflet-directive',
    'cgBusy',
    'ui.bootstrap',
    'ui.select'
]).
config(['$routeProvider', function ($routeProvider, RestangularProvider) {

    $routeProvider.when('/facilities', {templateUrl: 'partials/facilities.html',
    controller: 'facilitiesController'});

    $routeProvider.otherwise({redirectTo: '/facilities'});
    }]);
