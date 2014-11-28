'use strict';

angular.module('facilityReg.controllers').
    controller('facilitiesController', [
        '$scope', 'orgUnitService',  function ($scope,orgUnitService)
	{
            $scope.page = "";
            $scope.message = "FacilityReg Controller - Trying to get list of services";

            $scope.getFacilities = function() {
		        var P = "name:like:" + $scope.page;
                $scope.data = orgUnitService.all.get({filter: P});
            }

            // Saves the updated facility
            $scope.updateFacility = function($index) {

                $scope.orgResource.$update(function(reply) {
                    /* On success - Reload the updated facility */
                    var id = $scope.data.organisationUnits[$index].id;
                    orgUnitService.orgUnit.get({id:id},
                        function(result) {
                            $scope.data.organisationUnits[$index] = result;
                            $scope.selectFacility($index);
                        })
                });

            }

            // Index of which facility to expand
            $scope.currentIndex = -1;
            $scope.isEditing = false;

            $scope.selectFacility = function($index) {
                $scope.currentIndex = $index;
                $scope.isEditing = false;

                var id = $scope.data.organisationUnits[$index].id;
                orgUnitService.orgUnit.get({id:id},
                function(result) {
                    $scope.orgResource = result;
                });

            }

            $scope.deselectFacility = function() {
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
    }]);
