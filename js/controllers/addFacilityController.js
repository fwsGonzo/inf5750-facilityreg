'use strict';

angular.module('facilityReg.controllers').
    controller('addFacilityController', [
        '$scope',
        '$modalInstance',
        'leafletData',
        'orgUnitService',
        'mapSettingsService',
        'parentId',
        function($scope,$modalInstance,leafletData,orgUnitService,mapSettingsService,parentId) {

            $scope.addingNewFacility=true;

            //Fetch parent, or pass parent as param?
            $scope.parent = {};
            $scope.parent.name = parentId;

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
                $modalInstance.close($scope.facility.name);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            //Create the facility-object with variables
            $scope.facility = {};
            $scope.facility.level = 4;
            $scope.facility.name = "";
            $scope.facility.code = "";
            $scope.facility.shortName = "";
            $scope.facility.description = "";
            $scope.facility.featureType = "Point";
            $scope.facility.coordinates = "";
            $scope.facility.active = true;
            $scope.facility.displayName = "";
            $scope.facility.parent = {id: parentId};
            $scope.facility.organisationUnitGroups = new Array();
            $scope.facility.dataSets = new Array();

            /* Map */
            $scope.hideMap = false;


            angular.extend($scope, mapSettingsService.standardSettings);

            //FIXME This info is already fetched, rewrite function
            //FIXME please refactor me to a separate controller
            $scope.getLocation = function(facilityId) {

                //FIXME This should also be called on pageload to fix load
                leafletData.getMap().then(function(map) {
                    map.invalidateSize();
                });

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