'use strict';

angular.module('facilityReg.services')
    .factory('browseService',
    function($resource) {
        return {

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
            })
        }
    });
