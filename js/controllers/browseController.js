'use strict';

angular.module('facilityReg.controllers')
    .controller('browseController', [
    '$scope',
    '$routeParams',
    '$location',
    'browseService',
    function($scope,$routeParams,$location,browseService)
    {
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
    }]);
