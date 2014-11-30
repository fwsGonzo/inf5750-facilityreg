'use strict';

angular.module('facilityReg.controllers').
    controller('facilitiesController', [
        '$scope', 'orgUnitService',  function ($scope,orgUnitService)
	{
            $scope.userSearch = "";
            $scope.message = "FacilityReg Controller - Trying to get list of services";

            $scope.getFacilities = function() {

                var searchFilter = "";
                var index = $scope.userSearch.indexOf(":");
                /* If user wants to search for "field:value" */
                if(index !== -1) {
                    var field = $scope.userSearch.substring(0,index);
                    var value  = $scope.userSearch.substring(index+1,$scope.userSearch.length);
                    searchFilter = field+":like:"+value;
                } else {
                    /* Else, just search for name */
                    searchFilter = "name:like:" + $scope.userSearch;
                }

                $scope.data = orgUnitService.all.get({filter: searchFilter});

                // Deselects any selected facility
                $scope.currentIndex = -1;
            }

            $scope.selectParent = function (child) {
                    $scope.page = child.parent.name;
                    $scope.getFacilities();
                };

            $scope.getFacilityId = function($index) {
                return $scope.data.organisationUnits[$index].id;
            }

            // Saves the updated facility.
            $scope.updateFacility = function($index) {

                $scope.orgResource.$update(function() {
                    /* On success - Reload the updated facility */

                    var id = $scope.getFacilityId($index);
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

                var id = $scope.getFacilityId($index);
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
    }]);
