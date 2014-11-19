'use strict';

angular.module('facilityReg.services').factory('orgUnitService', function($resource) {
   return $resource(dhisAPI + '/api/organisationUnits/', {page:'@page'});
});