'use strict';

angular.module('facilityReg.services', [
    'ngResource'
]).config(['$httpProvider', function ($httpProvider) {

    //Define default headers
    $httpProvider.defaults.headers.common['Accept'] =
        "application/json;Charset=UTF-8";
    $httpProvider.defaults.headers.post['Content-Type'] =
         "application/json;Charset=UTF-8";
    $httpProvider.defaults.headers.put['Content-Type'] =
        "application/json;Charset=UTF-8";
}]);
