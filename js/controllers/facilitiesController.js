'use strict';

angular.module('facilityReg.controllers').
    controller('facilitiesController', [
        '$scope',
        '$routeParams',
        '$location',
        'orgUnitService',
    function ($scope,
              $routeParams,
              $location,
              orgUnitService)
	{
        $scope.search = "";
        $scope.message = "FacilityReg Controller - Trying to get list of services";

        $scope.isEditing   = false;
        $scope.currentItem = null;

        $scope.getFacilities =
        function()
        {
            if ($scope.search.length < 1) return;

            var searchFilter = "";
            var index = $scope.search.indexOf(":");
            /* If user wants to search for "field:value" */
            if (index !== -1)
            {
                var field = $scope.search.substring(0, index);
                var value = $scope.search.substring(index+1, $scope.search.length);
                searchFilter = field+":like:"+value;
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

        $scope.getFacilityId = function($index)
        {
            return $scope.currentSelection.organisationUnits[$index].id;
            //return $scope.data.organisationUnits[$index].id;
        }

        // Saves the updated facility.
        $scope.updateFacility = function($index)
        {
            $scope.orgResource.$update(function()
            {
                // On success - Reload the updated facility //
                var id = $scope.getFacilityId($index);
                orgUnitService.orgUnit.get({ id: id },
                    function(result) {
                        $scope.currentSelection.organisationUnits[$index] = result;
                        $scope.selectFacility($index);
                    })
            });
        }

        // Index of which facility to expand
        $scope.currentIndex = -1;
        $scope.isEditing = false;

        $scope.toggleFacility = function(item)
        {
            if (item === $scope.currentItem)
            {
                $scope.deselectFacility(); return;
            }
            $scope.selectFacility(item);
        };

        $scope.selectFacility = function(item)
        {
            $scope.currentItem = item;
            $scope.isEditing = false;

            // unload previous data
            $scope.orgUnit = null;

            // get new data
            orgUnitService.orgUnit.get({id: item.id},
            function(result) {
                $scope.orgResource = result;
            });
        }

        $scope.deselectFacility = function()
        {
            $scope.currentItem = null;
        }

        $scope.editFacility = function()
        {
            $scope.isEditing = true;
        }

        $scope.showExpandedFacility = function(item)
        {
            return $scope.isEditing === false
                && $scope.currentItem === item;
        }
        $scope.showEditable = function($item)
        {
            return !$scope.showExpandedFacility($item);
        }

        $scope.loadedYet =
        function()
        {
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


        function addToCrumb(item)
        {
            var trail = {
                depth   : depth,
                name    : item.name,
                id      : item.id
            };
            depth++;
            $scope.crumb.push(trail);
            //$location.url("/browse" + item.id);
            console.log($scope.crumb);

        }

        $scope.goToTrail = function(item)
        {
            $scope.crumb.splice(item.depth, depth-item.depth);
            console.log($scope.crumb);

            if (item.depth > 0)
            {
                depth = item.depth+1;
                //When clicking on an item, the item should be our new "selected index"
                //We should then fetch the items children, which should be on the items level+1
                var parentId = $scope.crumb[item.depth-1].id;
                $scope.currentSelection = orgUnitService.level.get({level: item.depth+1, parent: item.id})
            }else {
                depth = 1;
                $scope.currentSelection = orgUnitService.top.get();
            }
        };

        //Populate the initial array ( This could, and maybe should, be replaced with level 2 request )
        $scope.currentSelection = orgUnitService.top.get();
        $scope.currentSelection.$promise.then(function()
        {
            $scope.top = {
                depth    : 0,
                name     : $scope.currentSelection.name,
                id       : $scope.currentSelection.id
            }
        });

        $scope.goTo = function(item)
        {
            if(item.level != LOWEST_LEVEL)
            {
                addToCrumb(item);
                $scope.currentSelection = orgUnitService.level.get({level: item.level+1, parent: item.id});
            }
            else
            {
                // console.log("Showing facility: " + item.name);
                $scope.toggleFacility(item)
            }
        }

        $scope.setSearch = function(filter, selection)
        {
            $scope.currentSelection = selection;
            $scope.crumb = [];

            depth = 1;
            var trail = {
                depth   : depth,
                name    : "search: " + filter,
                id      : 0
            };
            depth++;
            $scope.crumb.push(trail);
        }

        /*
         *       Datasets & OrgUnitGroups
         */
        // Holds datasets removed in an edit
        // session by user
        $scope.availableDatasets = [];

        $scope.removeDataset = function (index) {
            var set = $scope.orgResource.dataSets[index];
            $scope.availableDatasets.push(set);
            $scope.orgResource.dataSets.splice(index, 1);
        }

        $scope.addToDataset = function (index) {
            var set = $scope.availableDatasets[index];
            $scope.orgResource.dataSets.push(set);
        }

        // Possible facility owners.
        // Public facilities, NGO, Mission, etc.
        $scope.facilityOwners = [];
        $scope.currentFacilityOwner;

        $scope.getAvailableFacilityOwners = function () {
            orgUnitService.facilityOwners.get(
                function (result) {
                    return result.organisationUnitGroups;
                });
        }

        $scope.facilityLocations = [];
        $scope.currentFacilityLocation;

        $scope.getAvailableFacilityLocations = function () {
            orgUnitService.facilityLocations.get(
                function (result) {
                    return result.organisationUnitGroups;
                });
        }

        $scope.facilityTypes = [];
        $scope.currentFacilityType;

        $scope.getAvailableFacilityTypes = function () {
            orgUnitService.facilityTypes.get(
                function (result) {
                    return result.organisationUnitGroups;
                });
        }

        var q;
        $scope.getOrganisationUnitGroups = function() {

            var $injector = angular.injector(['ng']);
            q = $injector.get('$q');

            return q( function () {
                $scope.facilityOwners = $scope.getAvailableFacilityOwners();
                $scope.facilityLocations = $scope.getAvailableFacilityLocations();
                $scope.facilityTypes = $scope.getAvailableFacilityTypes();

                console.log("1. Owners:");
                angular.forEach($scope.facilityOwners, function(owner) {
                    console.log(owner.name);
                })
                console.log("------------------");

                console.log("2. Locations:");
                angular.forEach($scope.facilityLocations, function(location) {
                    console.log(location.name);
                })
                console.log("------------------");

                console.log("3. Types:");
                angular.forEach($scope.facilityTypes, function(type) {
                    console.log(type.name);
                })
                console.log("------------------");
            });
        }

        $scope.populateOrgUnitGroups = function () {

            var promise = $scope.getOrganisationUnitGroups();
            promise.then(function () {

                console.log("4. OrgResource orgUnitGroups:");
                // Check against current orgResource's orgUnitGroups
                angular.forEach($scope.orgResource.organisationUnitGroups,
                    function (orgUnitGroup) {
                        console.log("orgUnitGroup: "+orgUnitGroup.name);

                    });

            });

            //$scope.currentFacilityOwner;
            //$scope.currentFacilityLocation;
            //$scope.currentFacilityType;

        }

    }]);
