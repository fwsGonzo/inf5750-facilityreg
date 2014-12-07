'use strict';

angular.module('facilityReg.controllers').
    controller('modalController', [
        '$scope',
        '$modalInstance',
        '$timeout',
        'leafletData',
        'orgUnitService',
        'userLocationService',
        'facilityId',
        function($scope,$modalInstance,$timeout,leafletData,orgUnitService,userLocationService, facilityId) {
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

            /* Initialized and used per edit "session" */
            $scope.currentFacilityOwners    = [];
            $scope.currentFacilityLocations = [];
            $scope.currentFacilityType      = [];

            $scope.filteredDataSets = [];

            $scope.loadResources = function () {

                orgUnitService.dataSets.get(function(response) {
                    $scope.availableDataSets = response.dataSets;
                });
                orgUnitService.facilityOwners.get(function (response) {
                    $scope.facilityOwners = response.organisationUnitGroups;
                });
                orgUnitService.facilityLocations.get(function (response) {
                    $scope.facilityLocations = response.organisationUnitGroups;
                });
                orgUnitService.facilityTypes.get(function (response) {
                    $scope.facilityTypes = response.organisationUnitGroups;
                });
            }

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

                orgUnitService.orgGroupCollection.update({facilityId:facilityId},
                    function(response) {

                        console.log("1."+response.organisationUnitGroups.length);
                    }, function(error) {
                        console.log(error);
                    });

                /*
                 orgUnitService.updateDataSets.delete({facilityId:facilityId,dataSetId:item.id},
                 function(response) {
                 $scope.filteredDataSets.push(item);
                 $scope.orgResource.dataSets.splice(index, 1);
                 });*/
            }

            $scope.addDataset = function (index) {
                var item         = $scope.filteredDataSets[index];
                var facilityId   = $scope.facility.id;

                $scope.facility.dataSets.push(item);
                $scope.filteredDataSets.splice(index, 1);
                console.log("1."+$scope.facility.organisationUnitGroups.length);
                console.log(facilityId);

                orgUnitService.orgGroupCollection.update({facilityId:facilityId},
                    function(response) {

                        console.log("1."+response.organisationUnitGroups.length);
                    });

                /*
                 orgUnitService.updateDataSets.add({facilityId:facilityId,dataSetId:item.id},
                 function(response) {
                 $scope.orgResource.dataSets.push(item);
                 $scope.filteredDataSets.splice(index, 1);
                 });*/
            }

            // Saves the updated facility.
            $scope.updateFacility = function($index)
            {
                /// ADDED ///
                $scope.setOrganisationUnitGroups();
                ///

                $scope.facility.$update(function()
                {
                    // On success - Reload the updated facility //
                    orgUnitService.orgUnit.get({ id: $scope.facility.id },
                        function(result) {
                            console.log("Facility updated");
                        })
                });
            }

            /* Called on update() */
            $scope.setOrganisationUnitGroups = function () {
                $scope.facility.organisationUnitGroups = [];

                if ($scope.currentFacilityOwner != null) {
                    $scope.facility.organisationUnitGroups.push($scope.currentFacilityOwner);
                }

                if ($scope.currentFacilityType != null) {
                    $scope.facility.organisationUnitGroups.push($scope.currentFacilityLocation);
                }

                if ($scope.currentFacilityLocation != null) {
                    $scope.facility.organisationUnitGroups.push($scope.currentFacilityType);
                }
            }

            $scope.sortFacilityOrgUnitGroups = function () {

                // Unload possible previous selections
                $scope.currentFacilityOwner    = null;
                $scope.currentFacilityLocation = null;
                $scope.currentFacilityType     = null;

                angular.forEach($scope.facilityOwners, function (owner) {
                    angular.forEach($scope.facility.organisationUnitGroups,
                        function (item) {
                            if (owner.id == item.id) {
                                //$scope.currentFacilityOwner = item;
                                $scope.currentFacilityOwner = owner;
                            }
                        })
                });

                angular.forEach($scope.facilityLocations, function (location) {
                    angular.forEach($scope.facility.organisationUnitGroups,
                        function (item) {
                            if (location.id == item.id) {
                                //$scope.currentFacilityLocation = item;
                                $scope.currentFacilityLocation = location;
                            }
                        })
                });

                angular.forEach($scope.facilityTypes, function (type) {
                    angular.forEach($scope.facility.organisationUnitGroups,
                        function (item) {
                            if (type.id == item.id) {
                                //$scope.currentFacilityType = item;
                                $scope.currentFacilityType = type;
                            }
                        })
                });
            }

            $scope.orgGroupChange = function (item) {
                console.log("From select:");
                console.log(item.id);
                console.log(item.name);
                console.log("----------");

                console.log("currentOwner:");
                console.log(currentFacilityOwner.id);
                console.log(currentFacilityOwner.name);
                console.log("----------");

                console.log("currentLocation:");
                console.log(currentFacilityLocation.id);
                console.log(currentFacilityLocation.name);
                console.log("----------");

                console.log("currentType:");
                console.log(currentFacilityType.id);
                console.log(currentFacilityType.name);
                console.log("----------");
            }

            /* Close / Dismiss the modal - send parameter to the controller who initialized the modal */
            $scope.ok = function () {
                $modalInstance.close($scope.facility.name);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            /* Map information */

            $scope.hideMap = false;

            angular.extend($scope, {
                defaults: {
                    scrollWheelZoom: false,
                    zoomLevel: 12
                },
                center: {
                    lat: 8.3,
                    lng: -11.3,
                    zoom: 10
                },
                layers: {
                    baselayers: {
                        googleRoadmap: {
                            name: 'Google Streets',
                            layerType: 'ROADMAP',
                            type: 'google'
                        },
                        googleTerrain: {
                            name: 'Google Terrain',
                            layerType: 'TERRAIN',
                            type: 'google'
                        },
                        googleHybrid: {
                            name: 'Google Hybrid',
                            layerType: 'HYBRID',
                            type: 'google'
                        }
                    }
                }
            });

            $scope.getUserLocation = function() {
                userLocationService.userLocation().then(function(userLoc) {
                    console.log(userLoc);
                });
            };

            $scope.redrawMap = function() {
                console.log("Drawing");
                $timeout(function() {
                    console.log("Drawing");
                    leafletData.getMap().then(function(map) {
                        map.invalidateSize();
                    });
                }, 100);
            };

            //FIXME This info is already fetched, rewrite function
            $scope.getLocation = function(facilityId) {

                $scope.redrawMap();

                $scope.location = orgUnitService.orgUnit.get({id: facilityId});
                //Attempt to resolve using promise
                $scope.location.$promise.then(function(data) {
                    $scope.hideMap = false;
                    if('coordinates' in data && data.level==4) {
                        var coordinates = JSON.parse(data.coordinates);
                        $scope.markers = new Array();
                        $scope.markers.push({
                            lat: coordinates[1],
                            lng: coordinates[0],
                            focus: true,
                            message: data.name,
                            draggable: false
                        });
                        $scope.center = {
                            lat: coordinates[1],
                            lng: coordinates[0],
                            zoom: 12
                        };
                        console.log("lat:" + $scope.center.lat);
                        console.log("lng:" + $scope.center.lng);
                    }
                    else {
                        console.log("Coordinates it not defined");
                    }

                }, function(error) {
                    console.log("Error - could not retrieve " + error)
                });
            }
        }]);