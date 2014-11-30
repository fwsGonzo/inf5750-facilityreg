'use strict';

angular.module('facilityReg.services')
  .factory('orgUnitService',
    function($resource)
    {
      return {
        all: $resource(dhisAPI + 'organisationUnits/',{
            fields: 'id,name,code',
            filter: '@filter'

        }),

        orgUnit: $resource(dhisAPI + 'organisationUnits/:id',
            {
                id: '@id'
            },
            {
                update: { method: 'put' }
            })};
    });
