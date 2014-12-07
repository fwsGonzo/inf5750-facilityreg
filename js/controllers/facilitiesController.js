'use strict';

angular.module('facilityReg.controllers').
    controller('facilitiesController', [
        '$scope',
        '$routeParams',
        '$location',
        '$modal',
        '$timeout',
        'orgUnitService',
        'staticDataService',
    function ($scope,
              $routeParams,
              $location,
              $modal,
              $timeout,
              orgUnitService,
              staticDataService)
	{
        $scope.search = "";
        $scope.message = "FacilityReg Controller - Trying to get list of services";

        $scope.isEditing   = false;
        $scope.currentItem = null;

        $scope.isSearching = null;

        // Load static data
        var load = staticDataService.get();

        $scope.createFacility = function(orgUnit)
        {
            var modalInstance = $modal.open({
                templateUrl: 'partials/editview.html',
                controller: 'addFacilityController',
                backdropClass: 'modal-backdrop-background',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    parentFacility: function () {
                        return orgUnit;
                    }
                }
            });

            modalInstance.result.then(
                function(data)
                {
                    // Success
                    console.log("User clicked ok");
                },
                function()
                {
                    // Dismissed (user pressed cancel)
                    console.log("user clicked cancel");
                });
        };

        $scope.getFacilities = function ()
        {
            if ($scope.search.length < 1) return;

            var searchFilter;
            searchFilter = "name:like:" + $scope.search;

            $scope.isSearching = orgUnitService.all.get({filter: searchFilter},
            function (names)
            {
                // temporary search parameters and results
                $scope.setSearch($scope.search, names);

                // continue searching, matching against codes
                searchFilter = "code:like:" + $scope.search;

                $scope.isSearching = orgUnitService.all.get({filter: searchFilter},
                function (codes)
                {
                    // concatenate codes and orgunit names
                    names.organisationUnits =
                        names.organisationUnits.concat(codes.organisationUnits);

                    // final search parameters and results
                    $scope.setSearch($scope.search, names);
                    // reset the promise, disabling the loading effect
                    $scope.isSearching = null;
                });
            });

            // Deselects the selected facility if selected
            $scope.currentItem = null;
        }

        $scope.selectParent = function (child)
        {
            $scope.search = child.parent.name;
            $scope.getFacilities();
        };

        $scope.getFacilityId = function ($index) {
            return $scope.currentSelection.organisationUnits[$index].id;
        }



        /*
        // Saves the updated facility.
        $scope.updateFacility = function($index)
        {
            /// ADDED ///
            $scope.setOrganisationUnitGroups();
            ///

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
        }*/

        $scope.toggleFacility = function(item)
        {
            if (item === $scope.currentItem)
            {
                $scope.deselectFacility(); return;
            }
            $scope.selectFacility(item);
        };

        $scope.selectFacility = function (item)
        {
            $scope.currentItem = item;
            $scope.isEditing = false;

            // unload previous data
            $scope.orgUnit = null;

            // get new data
            orgUnitService.orgUnit.get({id: item.id},
            function(result)
            {
                // set contents of expanded div
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
            if (item.depth > 0)
            {
                depth = item.depth+1;
                // When clicking on an item, the item should be our new "selected index"
                // We should then fetch the items children, which should be on the items level+1
                var parentId = $scope.crumb[item.depth-1].id;
                if (parentId === 0)
                {
                // assuming id==0 means its a search query
                // search queries store their results directly into the crumb trail
                    $scope.currentSelection = $scope.searchResults;
                }
                else
                {
                    $scope.currentSelection = orgUnitService.level.get({level: item.depth+1, parent: item.id})
                }
            }else {
                depth = 1;
                $scope.currentSelection = orgUnitService.top.get();
                // also, reset search when pressing home
                $scope.search = "";
            }
        };

        //Populate the initial array ( This could, and maybe should, be replaced with level 2 request )
        $scope.currentSelection = orgUnitService.top.get();
        $scope.currentSelection.$promise.then(function()
        {
            $scope.top = {
                depth : 0,
                name : $scope.currentSelection.name,
                id : $scope.currentSelection.id
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
        };

        $scope.setSearch = function(filter, results)
        {
            // set the current selection to the search results
            $scope.currentSelection = results;
            // remember the results so we can go back to them in the crumb-trail
            $scope.searchResults = results;
            // re-create crumb trail to Home -> Search [results]
            $scope.crumb = [];
            depth = 1;
            var trail = {
                depth : depth,
                name : "Search: " + filter,
                id : 0
            };
            //depth++;
            $scope.crumb.push(trail);
        };

        /* Modal / Edit+delete button */

        $scope.alerts = new Array();
        var alertId = 0;
        $scope.editFacility = function(facility) {
            //Open a modal
            var modalInstance = $modal.open({
                templateUrl: 'partials/editview.html',
                controller: 'modalController',
                backdropClass: 'modal-backdrop-background',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    facilityId: function () {
                        return facility.id;
                    }
                }
            });

            var timeOut = function(id) {
                $timeout(function() {$scope.closeAlert(id);}, 6000);
            };


            modalInstance.result.then(function(data) {

                console.log("Facility data");
                console.log(data);


                //Success
                $scope.alerts.push({
                    id: ++alertId,
                    type: 'success',
                    message: 'Successfully updated facility: ' + data
                });
                timeOut(alertId);
            },function() {
                //Dismissed(user pressed cancel)
                $scope.alerts.push({
                    id: ++alertId,
                    type: 'info',
                    message: 'Changes discarded'
                });
                timeOut(alertId);
            });
            //Get advanced information about the facility
        };

        // Saves the updated facility.
        $scope.updateFacility = function()
        {
            /// ADDED ///
            if($scope.facilityOrgGroupsChanged) {
                console.log("Updating facility organisationUnitGroups");
                $scope.setOrganisationUnitGroups();
            }
            ///

            $scope.facility.$update(function()
            {
                // On success - Reload the updated facility //
                orgUnitService.orgUnit.get({ id: $scope.facility.id },
                    function(result) {

                        console.log(result);
                        console.log("Facility updated");
                    }, function (error) {
                        console.log("Error updating facility");
                    });
            });
        };

        $scope.deleteFacility = function(facility)
        {
            // NOTE: This function did not work Dec.'14 due to a possible bug in DHIS2
            // See: https://www.dhis2.org/doc/snapshot/en/developer/html/dhis2_developer_manual_full.html#d4719e992
            // 1.8.2 Deleting objects
            
            // attempt to delete orgunit
            orgUnitService.orgUnit.delete({
                    id: facility.id
                },
                function (result)
                {
                    // deletion success:
                    // close expanded if currently opened
                    if ($scope.currentItem !== null)
                    {
                        if (facility === $scope.currentItem)
                        {
                            $scope.deselectFacility();
                        }
                    }
                    // remove from visible list
                    $scope.currentSelection.organisationUnits.splice(
                        $scope.currentSelection.organisationUnits.indexOf(facility), 1);

                    console.log("Deleting facility - success");
                },
                function (error)
                {
                    console.log("Deleting facility - error");
                    console.log(error);
                });
        };

        /* Alert */

        $scope.closeAlert = function(id) {
            console.log("Trying to close alert with id: " + id);
            $scope.alerts.forEach(function(element, index, array) {
                console.log(element);
                if(element.id==id) {
                    $scope.alerts.splice(index,1);
                    return;
                }
            });

        };



    }]);
