'use strict';

angular.module('facilityReg.services').
    factory('userLocationService',
    function() {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(userLoc) {
                return {
                    success: true,
                    message: "Success",
                    lat: userLoc.latitude,
                    lng: userLoc.longitude
                }
            });
        }
        else {
            return {
                success: false,
                message: "Userlocation not supported",
                lat: null,
                lng: null
            }
        }
    }
);