'use strict';

angular.module('facilityReg.controllers').
    controller('locationController', [
        '$scope',
        'orgUnitService',
        function($scope, orgUnitService) {

            $scope.facilities = orgUnitService.all.get();

            $scope.map = { center: { latitude: 8.466, longitude:-12.2231  }, zoom: 9 };

            //Track whether the selected facility has a location or not
            $scope.hasLocation = false;


            $scope.getLocation = function(facilityId) {

                $scope.location = orgUnitService.orgUnit.get({id: facilityId});
                //Attempt to resolve using promise
                $scope.location.$promise.then(function(data) {
                    if('coordinates' in data) {
                        var coordinates = JSON.parse(data.coordinates);
                        $scope.map.center = {latitude: coordinates[1], longitude: coordinates[0]};
                        $scope.marker = {
                            id: 0,
                            coords: {
                                latitude: coordinates[1],
                                longitude: coordinates[0]
                            },
                            options: {
                                draggable:true
                            },
                            events: {
                                dragend: function (marker, eventName, args) {
                                    $scope.newLocation = {};
                                    $scope.newLocation.latitude = marker.getPosition().lat();
                                    $scope.newLocation.longitude = marker.getPosition().lng();

                                }
                            }
                        };

                    }else {
                    console.log("Coordinates it not defined");
                }

            }, function(error) {
                console.log("Error - could not retrieve " + reason)
                });
            }
    }]);