'use strict';

angular.module('facilityReg.controllers').
    controller('modalController', [
        '$scope',
        '$modalInstance',
        'items',
        function($scope,$modalInstance, items) {
            $scope.items = items;

            $scope.ok = function () {
                $modalInstance.close(items);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);