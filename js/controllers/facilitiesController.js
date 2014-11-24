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
	    // When editing, this is created.
	    // Saved on submit.
	    $scope.tempFacility = {};

            $scope.selectFacility = function($index) {
                $scope.currentIndex = $index;
                $scope.isEditing = false;
            }

            $scope.deselectFacility = function() {
                // Prevents overwriting the index of the
                // facility we want to edit.
                if($scope.isEditing === false) {
                    $scope.currentIndex = -1;
                }
            }

            $scope.editFacility = function() {
                $scope.isEditing = true;
            }

            // Decides whether or not to display editable
            // forms. 
            $scope.showEditable = function($index) {
                return $scope.isEditing
                    && $scope.currentIndex === $index;
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

            $scope.updateFacility = function(facility, $index) {

		//$scope.tempFacility;		

                console.log("Scope facility id: "+$scope.data.organisationUnits[$index].id);
                console.log("Scope facility name: "+$scope.data.organisationUnits[$index].name);

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
