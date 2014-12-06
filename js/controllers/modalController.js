'use strict';

angular.module('facilityReg.controllers').
    controller('modalController', [
        '$scope',
        '$modalInstance',
        'orgUnitService',
        'facilityId',
        function($scope,$modalInstance, orgUnitService, facilityId) {
            $scope.facility = orgUnitService.orgUnit.get({id: facilityId});

            $scope.ok = function () {
                $modalInstance.close($scope.facility.name);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);