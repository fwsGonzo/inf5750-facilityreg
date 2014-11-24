'use strict';

angular.module('facilityReg.controllers').
    controller('facilitiesController', [
        '$scope', 'orgUnitService',  function ($scope,orgUnitService)
	{
            $scope.page = 1;
            $scope.message = "FacilityReg Controller - Trying to get list of services";

            $scope.getFacilities = function()
	    {
		var P = "name:like:" + $scope.page;
                $scope.data = orgUnitService.get({filter: P});
            }
    }]);
