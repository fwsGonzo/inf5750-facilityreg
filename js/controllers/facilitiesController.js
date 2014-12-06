'use strict';

angular.module('facilityReg.controllers').
    controller('facilitiesController', [
        '$scope',
        '$routeParams',
        '$location',
        'orgUnitService',
        '$q',
        function ($scope,
                  $routeParams,
                  $location,
                  orgUnitService) {
            $scope.search = "";
            $scope.message = "FacilityReg Controller - Trying to get list of services";

            $scope.isEditing = false;
            $scope.currentItem = null;

            $scope.getFacilities =
                function () {
                    if ($scope.search.length < 1) return;

                    var searchFilter = "";
                    var index = $scope.search.indexOf(":");
                    /* If user wants to search for "field:value" */
                    if (index !== -1) {
                        var field = $scope.search.substring(0, index);
                        var value = $scope.search.substring(index + 1, $scope.search.length);
                        searchFilter = field + ":like:" + value;
                        /*
                         * Sets the value of the search to 'value'
                         * because the results are filtered by it.
                         * Otherwise, our results would be filtered
                         * away.
                         */
                        $scope.search = value;
                    } else {
                        /* Else, just search for name */
                        searchFilter = "name:like:" + $scope.search;
                    }

                    $scope.setSearch(
                        $scope.search, orgUnitService.all.get({filter: searchFilter})
                    );

                    // Deselects the selected facility if selected
                    $scope.currentItem = null;
                }

            $scope.selectParent = function (child) {
                $scope.search = child.parent.name;
                $scope.getFacilities();
            };

            $scope.getFacilityId = function ($index) {
                return $scope.currentSelection.organisationUnits[$index].id;
                //return $scope.data.organisationUnits[$index].id;
            }

            // Saves the updated facility.
            $scope.updateFacility = function ($index) {

                /// ADDED ///
                $scope.setOrganisationUnitGroups();
                ///

                $scope.orgResource.$update(function () {
                    // On success - Reload the updated facility //
                    //var id = $scope.getFacilityId($index);
                    /* TODO: Fix getFacilityId above function */
                    var id = $scope.orgResource.id;
                    orgUnitService.orgUnit.get({id: id},
                        function (result) {
                            $scope.currentSelection.organisationUnits[$index] = result;
                            $scope.selectFacility($index);
                        })
                });
            }

            // Index of which facility to expand
            $scope.currentIndex = -1;
            $scope.isEditing = false;

            $scope.toggleFacility = function (item) {
                if (item === $scope.currentItem) {
                    $scope.deselectFacility();
                    return;
                }
                $scope.selectFacility(item);
            };

            $scope.selectFacility = function (item) {
                $scope.currentItem = item;
                $scope.isEditing = false;

                // unload previous data
                $scope.orgUnit = null;

                // get new data
                orgUnitService.orgUnit.get({id: item.id},
                    function (result) {

                        $scope.orgResource = result;

                        /// ADDED ///
                        $scope.sortFacilityOrgUnitGroups();
                        $scope.filterDataSets();
                    });
            }

            $scope.deselectFacility = function () {
                $scope.currentItem = null;
            }

            $scope.editFacility = function () {
                $scope.isEditing = true;
            }

            $scope.showExpandedFacility = function (item) {
                return $scope.isEditing === false
                    && $scope.currentItem === item;
            }
            $scope.showEditable = function ($item) {
                return !$scope.showExpandedFacility($item);
            }

            $scope.loadedYet =
                function () {
                    return $scope.orgUnit !== null;
                };


            //   ##############################################################
            //  ########           BREADCRUMB TRAIL                   ########
            // ##############################################################

            //The lowest possible level, reached the facilities. Stop when this one's reached
            var LOWEST_LEVEL = 4;

            //Create the breadcrumbtrail
            //FIXME I think this one can be refactored and stored in a seperate service, "BreadcrumbFactoryEnterpriseAwesomeness"
            $scope.crumb = [];
            $scope.top;
            var depth = 1;


            function addToCrumb(item) {
                var trail = {
                    depth: depth,
                    name: item.name,
                    id: item.id
                };
                depth++;
                $scope.crumb.push(trail);
                //$location.url("/browse" + item.id);
                console.log($scope.crumb);

            }

            $scope.goToTrail = function (item) {
                $scope.crumb.splice(item.depth, depth - item.depth);
                console.log($scope.crumb);

                if (item.depth > 0) {
                    depth = item.depth + 1;
                    //When clicking on an item, the item should be our new "selected index"
                    //We should then fetch the items children, which should be on the items level+1
                    var parentId = $scope.crumb[item.depth - 1].id;
                    $scope.currentSelection = orgUnitService.level.get({level: item.depth + 1, parent: item.id})
                } else {
                    depth = 1;
                    $scope.currentSelection = orgUnitService.top.get();
                }
            };

            //Populate the initial array ( This could, and maybe should, be replaced with level 2 request )
            $scope.currentSelection = orgUnitService.top.get();
            $scope.currentSelection.$promise.then(function () {
                $scope.top = {
                    depth: 0,
                    name: $scope.currentSelection.name,
                    id: $scope.currentSelection.id
                }
            });

            $scope.goTo = function (item) {
                if (item.level != LOWEST_LEVEL) {
                    addToCrumb(item);
                    $scope.currentSelection = orgUnitService.level.get({level: item.level + 1, parent: item.id});
                }
                else {
                    // console.log("Showing facility: " + item.name);
                    $scope.toggleFacility(item)
                }
            }

            $scope.setSearch = function (filter, selection) {
                $scope.currentSelection = selection;
                $scope.crumb = [];

                depth = 1;
                var trail = {
                    depth: depth,
                    name: "search: " + filter,
                    id: 0
                };
                depth++;
                $scope.crumb.push(trail);
            }

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

                angular.forEach($scope.orgResource.dataSets, function (facilityDataSet) {

                    angular.forEach($scope.filteredDataSets, function (dataSet) {
                        if (facilityDataSet.id == dataSet.id) {
                            $scope.filteredDataSets.splice($scope.filteredDataSets.indexOf(dataSet), 1);
                        }
                    });
                });
            }

            $scope.removeDataset = function (index) {
                var item         = $scope.orgResource.dataSets[index];
                var facilityId   = $scope.orgResource.id;

                $scope.filteredDataSets.push(item);
                $scope.orgResource.dataSets.splice(index, 1);

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
                var facilityId   = $scope.orgResource.id;

                $scope.orgResource.dataSets.push(item);
                $scope.filteredDataSets.splice(index, 1);
                console.log("1."+$scope.orgResource.organisationUnitGroups.length);
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

            /* Called on update() */
            $scope.setOrganisationUnitGroups = function () {
                $scope.orgResource.organisationUnitGroups = [];

                if ($scope.currentFacilityOwner != null) {
                    $scope.orgResource.organisationUnitGroups.push($scope.currentFacilityOwner);
                }

                if ($scope.currentFacilityType != null) {
                    $scope.orgResource.organisationUnitGroups.push($scope.currentFacilityLocation);
                }

                if ($scope.currentFacilityLocation != null) {
                    $scope.orgResource.organisationUnitGroups.push($scope.currentFacilityType);
                }
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

            $scope.sortFacilityOrgUnitGroups = function () {

                // Unload possible previous selections
                $scope.currentFacilityOwner    = null;
                $scope.currentFacilityLocation = null;
                $scope.currentFacilityType     = null;

                angular.forEach($scope.facilityOwners, function (owner) {
                    angular.forEach($scope.orgResource.organisationUnitGroups,
                        function (item) {
                            if (owner.id == item.id) {
                                //$scope.currentFacilityOwner = item;
                                $scope.currentFacilityOwner = owner;
                            }
                        })
                });

                angular.forEach($scope.facilityLocations, function (location) {
                    angular.forEach($scope.orgResource.organisationUnitGroups,
                        function (item) {
                            if (location.id == item.id) {
                                //$scope.currentFacilityLocation = item;
                                $scope.currentFacilityLocation = location;
                            }
                        })
                });

                angular.forEach($scope.facilityTypes, function (type) {
                    angular.forEach($scope.orgResource.organisationUnitGroups,
                        function (item) {
                            if (type.id == item.id) {
                                //$scope.currentFacilityType = item;
                                $scope.currentFacilityType = type;
                            }
                        })
                });
            }

        }]);