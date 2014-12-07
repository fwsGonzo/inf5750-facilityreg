'use strict';

angular.module('facilityReg.services').
    factory('addFacilityService', ['$http', '$q', '$rootScope', function($http,$q,$rootScope) {
        return {
            create: function(data) {
                return $http.post(dhisAPI + 'organisationUnits/', data);
            }
        }
    }]);