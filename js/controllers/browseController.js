'use strict';

angular.module('facilityReg.controllers')
    .controller('browseController', [
    '$scope',
    '$routeParams',
    '$location',
    '$modal',
    '$timeout',
    'browseService',
    function($scope,$routeParams,$location,$modal,$timeout,browseService)
    {
        //The lowest possible level, reached the facilities. Stop when this one's reached
        var LOWEST_LEVEL = 4;

        $scope.alerts = new Array();

        //Create the breadcrumbtrail
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
                $scope.currentSelection = browseService.level.get({level: item.depth+1, parent: item.id})
            }else {
                depth = 1;
                $scope.currentSelection = browseService.top.get();
            }
        };

        //Populate the initial array ( This could, and maybe should, be replaced with level 2 request )
        $scope.currentSelection = browseService.top.get();
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
                $scope.currentSelection = browseService.level.get({level: item.level+1, parent: item.id});
            }
        }

        var alertId = 0;
        $scope.editFacility = function(facility) {
            //Open a modal
            $scope.items = [0,1,2];
            var modalInstance = $modal.open({
                templateUrl: 'partials/editview.html',
                controller: 'modalController',
                backdropClass: 'modal-backdrop-background',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
                });

            var timeOut = function(id) {
                $timeout(function() {$scope.closeAlert(id);}, 6000);
            }

            modalInstance.result.then(function(data) {
                //Success
                $scope.alerts.push({
                    id: ++alertId,
                    type: 'success',
                    message: 'Successfully updated facility'
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

        $scope.deleteFacility = function(facility) {
            console.log(facility);
        };
    }]);
