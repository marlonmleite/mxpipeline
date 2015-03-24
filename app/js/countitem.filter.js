/**
 * @ngdoc filter
 * @name mxPipeline.filter:countItem
 * @function
 * @description
 * # countItem
 * Filter in the mxPipeline.
 */
angular.module('mxPipeline')
  .filter('countItem', function () {
    return function (input, showPrefix) {
      var prefix = '';

      input = input || [];

      showPrefix = showPrefix || false;

      if (showPrefix) {
        prefix = input.length > 1 ? ' itens' : ' item';
      }
      
      return input.length + prefix;
    };
  });
