'use strict';

angular.module('facilityReg.services')
    .factory('orgUnitService',
    function ($resource) {
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
                    update: {method: 'put'},
                    delete: {method: 'delete'}
                }),

            top: $resource(dhisAPI + 'organisationUnits/', {
                fields: 'id,name,code,level',
                filter: 'level:eq:1'
            }),

            all: $resource(dhisAPI + 'organisationUnits/', {
                fields: 'id,name,code,level',
                paging: 'false'
            }),

            level: $resource(dhisAPI + 'organisationUnits/?filter=level\\:eq\\::level&filter=parent.id\\:eq\\::parent', {
                fields: 'id,name,level,children',
                paging: 'false'
            }),

            facilityOwners: $resource(dhisAPI + 'organisationUnitGroupSets/:id', {
                id: 'Bpx0589u8y0',
                fields: "organisationUnitGroups"
            }),

            facilityLocations: $resource(dhisAPI + 'organisationUnitGroupSets/:id', {
                id: 'J5jldMd8OHv',
                fields: "organisationUnitGroups"
            }),

            facilityTypes: $resource(dhisAPI + 'organisationUnitGroupSets/:id', {
                id: 'Cbuj0VCyDjL',
                fields: "organisationUnitGroups"
            }),

            dataSets: $resource(dhisAPI + 'dataSets', {
            }),

            orgGroupCollection: $resource(dhisAPI + 'organisationUnits/:facilityId/organisationUnitGroups/', {}, {
                update: {
                    method: 'post',
                    params: {
                        facilityId: '@facilityId'
                    }
                }
            }),

            orgUnitGroup: $resource(dhisAPI + 'organisationUnitGroups/:orgUnitGroupId/organisationUnits/:facilityId', {}, {
                add: {
                    method: 'post',
                    params: {
                        facilityId: '@facilityId',
                        orgUnitGroupId: '@orgUnitGroupId'
                    }
                },
                delete: {
                    method: 'delete',
                    params: {
                        facilityId: '@facilityId',
                        orgUnitGroupId: '@orgUnitGroupId'
                    }
                }
            }),

            updateDataSets: $resource(dhisAPI + 'dataSets/:dataSetId/organisationUnits/:facilityId', {}, {
                add: {
                    method: 'post',
                    params: {
                        facilityId: '@facilityId',
                         dataSetId: '@dataSetId'
                    }
                },
                delete: {
                    method: 'delete',
                    params: {
                        facilityId: '@facilityId',
                         dataSetId: '@dataSetId'
                    }
                }
            })
        };
    });
/* Data that only needs to be loaded once - DataSets, organisationUnitGroups */
angular.module('facilityReg.services')
    .factory('staticDataService', ['orgUnitService', function(orgUnitService) {

        var staticData = [];

        return {
            get: function() {

                orgUnitService.dataSets.get(function(response) {
                    staticData.availableDataSets = response.dataSets;
                });
                orgUnitService.facilityOwners.get(function (response) {
                    staticData.facilityOwners = response.organisationUnitGroups;
                });
                orgUnitService.facilityLocations.get(function (response) {
                    staticData.facilityLocations = response.organisationUnitGroups;
                });
                orgUnitService.facilityTypes.get(function (response) {
                    staticData.facilityTypes = response.organisationUnitGroups;
                });

                return staticData;
            }
        }
}]);