/**
 * @ngdoc directive
 * @name mxPipeline.directive:mxPipeline
 * @description
 * # mxPipeline
 */
angular.module('mxPipeline')
  .directive('mxPipeline', ['$timeout', function ($timeout) {
    return {
      scope: {
      	mxDataProvider: '=mxDataProvider',
      	mxOnDrop: '&mxOnDrop',
      	mxItemClick: '&mxItemClick',
      	mxItemStateClick: '&mxItemStateClick',
      	mxFieldColumnKey: '@mxFieldColumnKey',
      	mxFieldColumnName: '@mxFieldColumnName',
      	mxFieldChildren: '@mxFieldChildren',
      	mxFieldChildKey: '@mxFieldChildKey',
      	mxFieldChildName: '@mxFieldChildName',
      	mxFieldChildPartner: '@mxFieldChildPartner',
      	mxFieldChildValue: '@mxFieldChildValue',
      	mxFieldChildState: '@mxFieldChildState',
      	mxFieldChildIcon: '@mxFieldChildIcon'
      },
      templateUrl: 'template/mxpipeline.tpl.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs, controller) {
      	controller.initializeDataProvider();
      },
      controller: 'Pipeline',
      controllerAs: 'vm'
    };
  }]);