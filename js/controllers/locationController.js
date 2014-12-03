'use strict';

angular.module('facilityReg.controllers').
    controller('locationController', [
        '$scope',
        'orgUnitService',
        function($scope, orgUnitService) {

            angular.extend($scope, {
                defaults: {
                    scrollWheelZoom: true,
                    zoomLevel: 18
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


            $scope.facilities = orgUnitService.all.get();


            //Track whether the selected facility has a location or not
            $scope.hasLocation = false;


            $scope.getLocation = function(facilityId) {

                $scope.location = orgUnitService.orgUnit.get({id: facilityId});
                //Attempt to resolve using promise
                $scope.location.$promise.then(function(data) {
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

                    }else {
                    console.log("Coordinates it not defined");
                }

            }, function(error) {
                console.log("Error - could not retrieve " + error)
                });
            }
    }]);