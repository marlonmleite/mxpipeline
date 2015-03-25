/**
 * @ngdoc directive
 * @name mxPipeline.directive:mxDroppable
 * @description
 * # mxDroppable
 */
angular.module('mxPipeline')
  .directive('mxDroppableAction', ['DataProvider', function (DataProvider) {
    return {
      require: '^mxPipeline',
      scope: {
      	mxDroppableType: '@mxDroppableType'
      },
      restrict: 'A',
      link: function postLink(scope, element, attrs, controller) {
        var elem = element[0];

        elem.addEventListener(
          'dragover', 
          function(e) {
          	e.dataTransfer.dropEffect = 'move';

          	if (e.preventDefault) {
          		e.preventDefault();
          	}

          	this.classList.add('over');

          	return false;
          },
          false
        );

        elem.addEventListener(
          'dragenter', 
          function(e) {
          	this.classList.add('over');
          	
          	return false;
          },
          false
        );

        elem.addEventListener(
          'dragleave', 
          function(e) {
          	this.classList.remove('over');
          	
          	return false;
          },
          false
        );

        elem.addEventListener(
          'drop', 
          function(e) {
          	var fromParent = document.getElementById(e.dataTransfer.getData('parentId'));
			      var itemDrop = document.getElementById(e.dataTransfer.getData('elementId'));
      		  var itemId = angular.element(itemDrop).attr('mx-id');
      		  var fromParentId = e.dataTransfer.getData('parentId');

            this.classList.remove('over');

        		if (e.stopPropagation) {
          		e.stopPropagation();
          	}

          	fromParent.removeChild(itemDrop);

          	DataProvider.removeRecord(fromParentId, itemId);

          	controller.onDropActionHandler(itemId, scope.mxDroppableType, e);

            controller.updateDataprovider();

          	return false;
          },
          false
        );
      }
    };
  }]);
