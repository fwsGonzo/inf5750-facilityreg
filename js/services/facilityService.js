'use strict';

angular.module('facilityReg.services').factory('facilityService', function($resource) {
   return $resource(dhisAPI + 'organisationUnits/:id', {id: '@id'});
});