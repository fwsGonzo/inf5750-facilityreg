'use strict';

angular.module('facilityReg.services', [
    'ngResource'
]).config(['$httpProvider', function ($httpProvider) {

    //Define default headers
    $httpProvider.defaults.headers.common['Accept'] =
        "application/json, text/plain, * / *";
    $httpProvider.defaults.headers.post['Content-Type'] =
         "application/json";
    $httpProvider.defaults.headers.put['Content-Type'] =
        "application/json";
}]);