'use strict';

<<<<<<< HEAD
angular.module('facilityReg.services').factory('orgUnitService', function($resource) {
   return $resource(dhisAPI + 'organisationUnits/', {page:'@page'});
});
=======
angular.module('facilityReg.services')
  .factory('orgUnitService',
    function($resource)
    {
      return $resource(dhisAPI + 'organisationUnits/',
      {
          filter: '@filter'
          
      });
    }
  );

>>>>>>> 44f96117fcc1f0ab106203337bd98a9f25627c06
