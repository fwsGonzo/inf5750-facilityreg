'use strict';

angular.module('facilityReg.controllers').
    controller('addFacilityController', [
        '$scope',
        '$modalInstance',
        '$timeout',
        'leafletData',
        'orgUnitService',
        'mapSettingsService',
        'userLocationService',
        'parentFacility',
        function($scope,$modalInstance,$timeout,
                 leafletData,
                 orgUnitService,mapSettingsService,userLocationService,
                 parentFacility) {

            $scope.addingNewFacility=true;

            //Fetch parent, or pass parent as param?
            $scope.parent = parentFacility;

            $scope.owner = {};
            $scope.ownerTypes= [
                {name:"En eier"},
                {name:"to eier"},
                {name:"tre eier"},
                {name:"fire eier"},
                {name:"fem eier"}
            ];

            /* Fire events on close/dismiss the modal */
            $scope.ok = function () {
                //Set location (if any)
                if(angular.isDefined($scope.coordinates) &&
                    angular.isDefined($scope.coordinates.lat) &&
                    angular.isDefined($scope.coordinates.lng)) {
                    $scope.facility.coordinates = "["+$scope.coordinates.lat + "," + $scope.coordinates.lng + "]";
                    $scope.featureType = "Point";
                }


                //Try to create a new facility
                //Api call here
                //Check for errors and display alert if user is retarded

                //Do magic relevant to setting the correct organisationUnitGroups
                //Api call here
                //Check for errors and display alert if user is retarded

                //Do magic relevant to setting the correct dataSets
                //

                console.log($scope.facility);
                $modalInstance.close($scope.facility.name);
            };

            $scope.cancel = function () {
                //Display prompt to confirm exit if changes has been made
                $modalInstance.dismiss('cancel');
            };

            //Create the facility-object with variables
            $scope.facility = {};
            $scope.facility.level = 4;
            $scope.facility.name = "";
            $scope.facility.code = "";
            $scope.facility.shortName = "";
            $scope.facility.description = "";
            $scope.facility.active = true;
            $scope.facility.displayName = "";
            $scope.facility.parent = {id:$scope.parent.id};
            $scope.facility.organisationUnitGroups = new Array();
            $scope.facility.dataSets = new Array();

            /* Map */
            $scope.hideMap = false;

            $scope.redrawMap = function() {
                $timeout(function() {
                    leafletData.getMap().then(function(map) {
                        map.invalidateSize();
                    });
                }, 100);
            };

            angular.extend($scope, mapSettingsService.standardSettings);

            $scope.getUserLocation = function() {
              userLocationService.userLocation().then(function(userLoc) {
                  console.log(userLoc);
                  $scope.setMarker({
                      lat:userLoc.coords.latitude,
                      lng:userLoc.coords.longitude
                  });
              })
            };

            $scope.setMarker = function(loc) {
                $scope.coordinates = {lat: loc.lat, lng: loc.lng};
                $scope.markers = new Array();
                $scope.markers.push({
                    lat: loc.lat,
                    lng: loc.lng,
                    focus: true,
                    message: $scope.facility.name,
                    draggable: false
                });
                $scope.center = {
                    lat: loc.lat,
                    lng: loc.lng,
                    zoom: 12
                };
            };

            $scope.getLocation = function(facilityId) {
                $scope.location = orgUnitService.orgUnit.get({id: facilityId});
                //Attempt to resolve using promise
                $scope.location.$promise.then(function(data) {
                    $scope.hideMap = false;
                    if('coordinates' in data && data.level==4) {
                        var coordinates = JSON.parse(data.coordinates);
                        $scope.markers = new Array();
                        $scope.setMarker({lat:coordinates[1],lng:coordinates[0]});
                    }
                    else {
                        console.log("Coordinates it not defined");
                    }

                }, function(error) {
                    console.log("Error - could not retrieve " + error)
                });
            }


        }]);