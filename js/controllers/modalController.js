'use strict';

angular.module('facilityReg.controllers').
    controller('modalController', [
        '$scope',
        '$modalInstance',
        '$timeout',
        '$q',
        'leafletData',
        'orgUnitService',
        'userLocationService',
        'mapSettingsService',
        'staticDataService',
        'facilityId',
        function($scope,$modalInstance,$timeout,$q,
                 leafletData,
                 orgUnitService,userLocationService,mapSettingsService,staticDataService,
                 facilityId) {

            $scope.loadResources = function() {
                $scope.availableDataSets = staticDataService.get().availableDataSets;
                $scope.facilityOwners = staticDataService.get().facilityOwners;
                $scope.facilityLocations = staticDataService.get().facilityLocations;
                $scope.facilityTypes = staticDataService.get().facilityTypes;
            };
            
            $scope.facility = orgUnitService.orgUnit.get({id: facilityId} ,
            function() {
                $scope.sortFacilityOrgUnitGroups();
                $scope.filterDataSets();
            });

            /*
             *       Datasets & OrgUnitGroups
             */
            $scope.facilityTypes     = [];
            $scope.facilityOwners    = [];
            $scope.facilityLocations = [];

            $scope.availableDataSets = [];

            $scope.dropDownNull = [];
            $scope.dropDownNull.id = -1;
            $scope.dropDownNull.name = "[ Empty ]";

            /* Initialized and used per edit "session" */
            $scope.currentFacilityOwners    = [];
            $scope.currentFacilityLocations = [];
            $scope.currentFacilityType      = [];

            $scope.filteredDataSets         = [];
            $scope.facilityOrgGroupsChanged = false;

            /* Remove datasets already in use by facility */
            $scope.filterDataSets = function () {
                $scope.filteredDataSets = angular.copy($scope.availableDataSets);

                angular.forEach($scope.facility.dataSets, function (facilityDataSet) {

                    angular.forEach($scope.filteredDataSets, function (dataSet) {
                        if (facilityDataSet.id == dataSet.id) {
                            $scope.filteredDataSets.splice($scope.filteredDataSets.indexOf(dataSet), 1);
                        }
                    });
                });
            }

            $scope.removeDataset = function (index) {
                var item         = $scope.facility.dataSets[index];
                var facilityId   = $scope.facility.id;

                $scope.filteredDataSets.push(item);
                $scope.facility.dataSets.splice(index, 1);

                orgUnitService.updateDataSets.delete({facilityId:facilityId,dataSetId:item.id},
                    function(response) {
                        //console.log("Dataset removed");
                    }, function(error) {
                        //console.log(error);
                        console.log("Error - Removing dataset");
                    });
            };

            $scope.addDataset = function (index) {
                var item         = $scope.filteredDataSets[index];
                var facilityId   = $scope.facility.id;

                $scope.facility.dataSets.push(item);
                $scope.filteredDataSets.splice(index, 1);

                orgUnitService.updateDataSets.add({facilityId:facilityId,dataSetId:item.id},
                    function(response) {
                        //console.log("Dataset added");
                    }, function(error) {
                        //console.log(error);
                        console.log("Error - Adding dataset");
                    });
            };


            // Saves the updated facility.
            $scope.updateFacility = function()
            {
                if($scope.facilityOrgGroupsChanged) {
                    $scope.setOrganisationUnitGroups();
                }

                $scope.facility.$update(function()
                {
                    // On success - Reload the updated facility //
                    orgUnitService.orgUnit.get({ id: $scope.facility.id },
                        function(result) {
                            console.log("Facility updated");
                        }, function (error) {
                            console.log("Error updating facility");
                        });
                });
            };

            /* Called on update() */
            $scope.setOrganisationUnitGroups = function () {

                if($scope.facility.organisationUnitGroups == null) {
                    return;
                }

                var successCounter = 0;
                var finished = $scope.facility.organisationUnitGroups.length;
                var timeout = 4000;

                var promise = $q( function (resolve, reject) {

                    angular.forEach($scope.facility.organisationUnitGroups,
                    function(group) {

                        orgUnitService.orgUnitGroup.delete(
                            {
                                facilityId: $scope.facility.id,
                                orgUnitGroupId: group.id
                            },
                            function (response) {
                                successCounter++;
                                //console.log("deleting orgUnitGroup - ");
                                //console.log(response);
                            }, function (error) {
                                console.log("Error deleting orgUnitGroup - " + error);
                            });

                        setTimeout(function () {
                            if (successCounter == finished) {
                                resolve();
                            } else {
                                console.log("Error removing old organisationUnitGroups");
                                reject();
                            }
                        }, timeout);
                    }
                )});

                if($scope.currentFacilityOwner.id != $scope.dropDownNull.id) {

                    /* Add owner */
                    orgUnitService.orgUnitGroup.add(
                        {
                            facilityId:     $scope.facility.id,
                            orgUnitGroupId: $scope.currentFacilityOwner.id
                        },
                        function(response) {
                            //console.log(response);
                        }, function(error) {
                            //console.log(error);
                            console.log("Error adding owner");
                        });

                }

                if($scope.currentFacilityLocation.id != $scope.dropDownNull.id) {

                    /* Add location */
                    orgUnitService.orgUnitGroup.add(
                        {
                            facilityId:     $scope.facility.id,
                            orgUnitGroupId: $scope.currentFacilityLocation.id
                        },
                        function(response) {
                            //console.log(response);
                            //console.log("Successfully added location");
                        }, function(error) {
                            //console.log(error);
                            console.log("Error adding location");
                        });
                }


                if($scope.currentFacilityType.id != $scope.dropDownNull.id) {

                    /* Add type */
                    orgUnitService.orgUnitGroup.add(
                        {
                            facilityId:     $scope.facility.id,
                            orgUnitGroupId: $scope.currentFacilityType.id
                        },
                        function(response) {
                            //console.log(response);
                            //console.log("Successfully added type");
                        }, function(error) {
                            //console.log(error);
                            console.log("Error adding type");
                        });
                }
            };

            $scope.sortFacilityOrgUnitGroups = function () {

                // Unload possible previous selections
                $scope.currentFacilityOwner    = null;
                $scope.currentFacilityLocation = null;
                $scope.currentFacilityType     = null;

                $scope.facilityOwners.push($scope.dropDownNull);
                $scope.facilityLocations.push($scope.dropDownNull);
                $scope.facilityTypes.push($scope.dropDownNull);

                angular.forEach($scope.facilityOwners, function (owner) {
                    angular.forEach($scope.facility.organisationUnitGroups,
                        function (item) {
                            if (owner.id == item.id) {
                                //$scope.currentFacilityOwner = item;
                                $scope.currentFacilityOwner = owner;
                            }
                        });
                    if($scope.currentFacilityOwner == null) {
                        $scope.currentFacilityOwner = $scope.dropDownNull;
                    }
                });

                angular.forEach($scope.facilityLocations, function (location) {
                    angular.forEach($scope.facility.organisationUnitGroups,
                        function (item) {
                            if (location.id == item.id) {
                                //$scope.currentFacilityLocation = item;
                                $scope.currentFacilityLocation = location;
                            }
                        });
                    if($scope.currentFacilityLocation == null) {
                        $scope.currentFacilityLocation = $scope.dropDownNull;
                    }
                });

                angular.forEach($scope.facilityTypes, function (type) {
                    angular.forEach($scope.facility.organisationUnitGroups,
                        function (item) {
                            if (type.id == item.id) {
                                //$scope.currentFacilityType = item;
                                $scope.currentFacilityType = type;
                            }
                        });
                    if($scope.currentFacilityType == null) {
                        $scope.currentFacilityType = $scope.dropDownNull;
                    }
                });
            };

            $scope.orgGroupChanged = function () {
                $scope.facilityOrgGroupsChanged = true;
            };

            /* Close / Dismiss the modal - send parameter to the controller who initialized the modal */
            $scope.ok = function (validForm) {

                if(validForm) {
                    $scope.updateFacility();
                    $modalInstance.close($scope.facility.name);
                } else {
                    console.log("Reported.")
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            /* Map information */

            $scope.hideMap = false;

            angular.extend($scope, mapSettingsService.standardSettings);

            $scope.getUserLocation = function() {
                userLocationService.userLocation().then(function(userLoc) {
                    console.log(userLoc);
                });
            };

            $scope.redrawMap = function() {
                $timeout(function() {
                    leafletData.getMap().then(function(map) {
                        map.invalidateSize();
                    });
                }, 100);
            };

            //FIXME This info is already fetched, rewrite function
            $scope.getLocation = function(facilityId) {



                $scope.location = orgUnitService.orgUnit.get({id: facilityId});
                //Attempt to resolve using promise
                $scope.location.$promise.then(function(data) {
                    $scope.hideMap = false;
                    if('coordinates' in data && data.level==4) {
                        $scope.coordinates = JSON.parse(data.coordinates);
                        $scope.markers = new Array();
                        $scope.markers.push({
                            lat: $scope.coordinates[1],
                            lng: $scope.coordinates[0],
                            focus: true,
                            message: data.name,
                            draggable: false
                        });
                        $scope.center = {
                            lat: $scope.coordinates[1],
                            lng: $scope.coordinates[0],
                            zoom: 12
                        };
                        console.log("lat:" + $scope.center.lat);
                        console.log("lng:" + $scope.center.lng);
                        $scope.redrawMap();
                    }
                    else {
                        console.log("Coordinates it not defined");
                    }

                }, function(error) {
                    console.log("Error - could not retrieve " + error)
                });
            }
        }]);