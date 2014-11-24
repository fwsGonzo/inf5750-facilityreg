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

            // Index of which facility to expand
            $scope.currentIndex = -1;
            $scope.isEditing = false;

            $scope.selectFacility = function($index) {
                $scope.currentIndex = $index;
                $scope.isEditing = false;
            }

            $scope.deselectFacility = function($index) {
                // Prevents overwriting the index of the
                // facility we want to edit.
                if($scope.isEditing === false) {
                    $scope.currentIndex = -1;
                }
            }

            $scope.editFacility = function($index) {
                $scope.isEditing = true;
            }

            // Decides whether or not to display editable
            // forms. 
            $scope.showEditable = function($index) {
                return $scope.isEditing
                    && $scope.currentIndex === $index;;
            }

            $scope.showFacilityHeader = function($index) {
                // If editing, show other facility headers 
                if($scope.isEditing
                    && $index !== $scope.currentIndex) {
                    return true;
                }

                // If not selected facility, show header 
                return $index !== $scope.currentIndex;
            }

            $scope.showExpandedFacility = function($index) {
                if($scope.isEditing === false
                    && $scope.currentIndex === $index) {
                    return true;
                } else {
                    return false;
                }
            }

            $scope.updateFacility = function(facilityName, facility, $index) {
                console.log("Updating: ");
                console.log("Facility id: "+facility.id);
                console.log("Facility name: "+facility.name);
                // TODO: Find the proper way 
                // Lag model for "ny facility", på submit -> legg inn
                //$scope.testdata.facilities[facility.id - 1].name = $scope.facilityName;

                console.log("Scope facility id: "+$scope.testdata.facilities[facility.id - 1].id);
                console.log("Scope facility name: "+$scope.testdata.facilities[facility.id - 1].name);

                $scope.selectFacility($index);
            }

            $scope.getTestFacilities = function() {
                var testFacilities = {"facilities": [
                    {"id": "1", "name": "Bamboleo"},
                    {"id": "2", "name": "Zalooba"},
                    {"id": "3", "name": "Zairobi"},
                    {"id": "4", "name": "Caramba"}
                ]};
                $scope.testdata = testFacilities;
            }
    }]);
