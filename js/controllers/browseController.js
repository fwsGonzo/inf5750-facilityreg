'use strict';

angular.module('facilityReg.controllers')
    .controller('browseController', [
    '$scope',
    'browseService',
    function($scope,browseService) {
        //The lowest possible level, reached the facilities. Stop when this one's reached
        var LOWEST_LEVEL = 4;

        //Create the breadcrumbtrail
        //FIXME I think this one can be refactored and stored in a seperate service, "BreadcrumbFactoryEnterpriseAwesomeness"
        $scope.crumb = [];
        var depth = 0;
        function addToCrumb(item) {

            var trail = {
                depth   : depth,
                name    : item.name,
                id      : item.id
            };
            depth++;
            $scope.crumb.push(trail);
            console.log($scope.crumb);
        }

        $scope.goToTrail = function(item){
            //Remove the last items
            console.log("No splice!");
            $scope.crumb.splice(item.depth, depth-item.depth);
            console.log($scope.crumb);
            console.log("spliced!");
            depth = item.depth;
            if (item.depth > 0) {
                var parentId = $scope.crumb[item.depth-1].id;
                $scope.currentSelection = browseService.level.get({level: depth+1, parent: parentId})
            }else {
                $scope.currentSelection = browseService.top.get();
            }
        };

        //Populate the initial array ( This could, and maybe should, be replaced with level 2 request )
        $scope.currentSelection = browseService.top.get();


        $scope.goTo = function(item) {
            if(item.level != LOWEST_LEVEL) {
                addToCrumb(item);
                $scope.currentSelection = browseService.level.get({level: item.level+1, parent: item.id});
            }
        }
    }]);
