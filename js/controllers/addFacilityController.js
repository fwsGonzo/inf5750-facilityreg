'use strict';

angular.module('facilityReg.controllers').
    controller('modalController', [
        '$scope',
        '$modalInstance',
        'leafletData',
        'orgUnitService',
        'parentId',
        function($scope,$modalInstance,leafletData,orgUnitService, parentId) {

            /* Fire events on close/dismiss the modal */
            $scope.ok = function () {
                $modalInstance.close($scope.facility.name);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            //Create the facility-object with variables
            $scope.facility.level = 4;
            $scope.facility.name = "";
            $scope.facility.code = "";
            $scope.facility.shortName = "";
            $scope.facility.featureType = "Point";
            $scope.facility.coordinates = "";
            $scope.facility.active = true;
            $scope.facility.displayName = "";
            $scope.facility.parent = {id: parentId};
            $scope.facility.organisationUnitGroups = new Array();
            $scope.facility.dataSets = new Array();

            /* Map */



        }]);