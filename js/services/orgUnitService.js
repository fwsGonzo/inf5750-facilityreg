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
                    update: {method: 'put'}
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

            /* https://apps.dhis2.org/demo/api/organisationUnitGroupSets.json */
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

            orgUnitGroup: $resource(dhisAPI + 'organisationUnitGroups/:orgUnitGroupId/organisationUnits/:id', {}, {
                add: {
                    method: 'post',
                    params: {
                        id: '@id',
                        orgUnitGroupId: '@orgUnitGroupId'
                    }
                },
                delete: {
                    method: 'delete',
                    params: {
                        id: '@id',
                        orgUnitGroupId: '@orgUnitGroupId'
                    }
                }
            }),

            updateDataSets: $resource(dhisAPI + 'organisationUnits/:facilityId/dataSets/:dataSetId', {}, {
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