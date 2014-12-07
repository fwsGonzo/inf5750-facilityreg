'use strict';

angular.module('facilityReg.services').
    factory('userLocationService', [
        '$q',
        '$window',
        '$rootScope',
        function($q, $window, $rootScope) {
            return {
                userLocation: function() {
                    //Create a promise
                    var deferred = $q.defer();

                    if ($window.navigator.geolocation) {
                        $window.navigator.geolocation.getCurrentPosition(function (userLoc) {
                            $rootScope.$apply(function() {
                                deferred.resolve(userLoc);
                            });
                        });
                    }
                    else {
                        $rootScope.$apply(function() {
                           deferred.reject("Location not supported");
                        });
                    }
                    return deferred.promise;
                }

            }
        }]);