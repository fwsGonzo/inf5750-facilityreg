'use strict';

angular.module('facilityReg.services')
  .factory('orgUnitService',
    function($resource)
    {
      return {
        /*all: $resource(dhisAPI + 'organisationUnits/',{
            fields: 'id,name,code',
            filter: '@filter'

        }),*/

        orgUnit: $resource(dhisAPI + 'organisationUnits/:id',
            {
                id: '@id'
            },
            {
                update: { method: 'put' }
            }),


        top:    $resource(dhisAPI + 'organisationUnits/', {
              fields: 'id,name,code,level',
              filter: 'level:eq:1'
            }),
        all:    $resource(dhisAPI + 'organisationUnits/', {
              fields: 'id,name,code,level',
              paging: 'false'
            }),
        level:  $resource(dhisAPI + 'organisationUnits/?filter=level\\:eq\\::level&filter=parent.id\\:eq\\::parent', {
              fields: 'id,name,level,children',
              paging: 'false'
            }),

        facilityOwners:    $resource(dhisAPI + 'organisationUnitsGroups/', {
              id: "Bpx0589u8y0"
            }),

        facilityLocations:    $resource(dhisAPI + 'organisationUnitsGroups/', {
              id: "Cbuj0VCyDjL"
            }),

        facilityTypes:    $resource(dhisAPI + 'organisationUnitsGroups/', {
              id: "J5jldMd8OHv"
            })

      };
    });
