'use strict';

angular.module('facilityReg.services')
  .factory('orgUnitService',
    function($resource)
    {
      return {
        all: $resource(dhisAPI + 'organisationUnits/',{
            filter: '@filter'
        }),
        orgUnit: $resource(dhisAPI + 'organisationUnits/:id',
            {id: '@id'})
      };
    });
