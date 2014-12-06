'use strict';

angular.module('facilityReg.controllers').
    controller('modalController', [
        '$scope',
        '$modalInstance',
        'orgUnitService',
        'facilityId',
        function($scope,$modalInstance, orgUnitService, facilityId) {
            $scope.facility = orgUnitService.orgUnit.get({id: facilityId});

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


            //FIXME make use of users current location
            $scope.alerts = new Array();

            $scope.getUserLocation = function() {
                console.log("Getting location???");
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(userLoc) {
                        $scope.alerts.push({
                            message: "Current location is: " + userLoc.coords.latitude + ", " + userLoc.coords.longitude,
                            type: 'success'
                        });
                    });
                }
                else {
                    $scope.alerts.push({
                        message: "Not supported!",
                        type: 'danger'
                    });
                }
            };

            //FIXME This info is already fetched, rewrite function
            $scope.getLocation = function(facilityId) {

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