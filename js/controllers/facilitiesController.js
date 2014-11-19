'use strict';

angular.module('facilityReg.controllers').
    controller('facilitiesController', [
        '$scope', 'orgUnitService',  function ($scope,orgUnitService) {

            $scope.page = 1;
            $scope.message = "FacilityReg Controller - Trying to get list of services";

            $scope.getFacilities = function() {
                console.log("hello world");
                $scope.data = orgUnitService.get({page: $scope.page});

            }
    }]);