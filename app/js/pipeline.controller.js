/**
 * @ngdoc controller
 * @name mxPipeline.controller:Pipeline
 * @description
 * # mxPipeline
 */
angular.module('mxPipeline')
  .controller('Pipeline', ['$scope', '$timeout', '$log', 'DataProvider', function($scope, $timeout, $log, DataProvider){
    var vm = this;
    vm.mxFieldColumnKey = $scope.mxFieldColumnKey;
    vm.mxFieldColumnName = $scope.mxFieldColumnName;
    vm.mxFieldChildren = $scope.mxFieldChildren;
    vm.mxFieldChildKey = $scope.mxFieldChildKey;
    vm.mxFieldChildName = $scope.mxFieldChildName;
    vm.mxFieldChildPartner = $scope.mxFieldChildPartner;
    vm.mxFieldChildValue = $scope.mxFieldChildValue;
    vm.mxFiledChildState = $scope.mxFiledChildState;
    vm.mxFieldChildIcon = $scope.mxFieldChildIcon;

    vm.validateAttrs = function validateAttrs() {
      if (!angular.isDefined($scope.mxFieldColumnKey)) {
            $log.error("The attribute 'mx-field-column-key' was not declared to your directive.");
          }

          if (!angular.isDefined($scope.mxFieldColumnName)) {
            $log.error("The attribute 'mx-field-column-name' was not declared to your directive.");
          }

          if (!angular.isDefined($scope.mxFieldChildren)) {
            $log.error("The attribute 'mx-field-children' was not declared to your directive.");
          }

          if (!angular.isDefined($scope.mxFieldChildKey)) {
            $log.error("The attribute 'mx-field-child-key' was not declared to your directive.");
          }

          if (!angular.isDefined($scope.mxFieldChildName)) {
            $log.error("The attribute 'mx-field-child-name' was not declared to your directive.");
          }

          if (!angular.isDefined($scope.mxFieldChildValue)) {
            $log.error("The attribute 'mx-field-child-value' was not declared to your directive.");
          }
    };

    vm.validateAttrs();

    vm.onDropHandler = function onDropHandler(id) {
      $timeout(function() {
        $scope.$apply(function(scope) {
                var fn = scope.mxOnDrop();

                if ('undefined' !== typeof fn) {
                  fn(id, event);
                }
            });
      });
    };

    vm.itemClickHandler = function itemClickHandler(id) {
      $timeout(function() {
        $scope.$apply(function(scope) {
                var fn = scope.mxItemClick();

                if ('undefined' !== typeof fn) {
                  fn(id, event);
                }
            });
      });
    };

    vm.stateClickHandler = function stateClickHandler(event, id) {
      event.stopPropagation();

      $timeout(function() {
        $scope.$apply(function(scope) {
                var fn = scope.mxItemStateClick();

                if ('undefined' !== typeof fn) {
                  fn(id, event);
                }
            });
      });
    };

    vm.initializeDataProvider = function initializeDataProvider() {
      DataProvider.set($scope.mxDataProvider);
      DataProvider.setFieldColumnId(vm.mxFieldColumnKey);
      DataProvider.setFieldColumnChildren(vm.mxFieldChildren);
      DataProvider.setFieldChildId(vm.mxFieldChildKey);
    };

    vm.sumValues = function sumValues(children) {
      var total = 0;

      if (angular.isArray(children) && children.length > 0) {
        children.forEach(function(child, index){
          if (child.hasOwnProperty(vm.mxFieldChildValue) && angular.isNumber(child[vm.mxFieldChildValue])) {
            total += child[vm.mxFieldChildValue];
          }
        });
      }

      return total;
    };
  }]);