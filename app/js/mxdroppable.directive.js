/**
 * @ngdoc directive
 * @name mxPipeline.directive:mxDroppable
 * @description
 * # mxDroppable
 */
angular.module('mxPipeline')
  .directive('mxDroppable', ['DataProvider', function (DataProvider) {
    return {
      require: '^mxPipeline',
      restrict: 'A',
      link: function postLink(scope, element, attrs, controller) {
        var elem = element[0];
        var stageAction;

        elem.addEventListener(
          'dragover', 
          function(e) {
          	e.dataTransfer.dropEffect = 'move';

          	if (e.preventDefault) {
          		e.preventDefault();
          	}

            stageAction = document.getElementById('mx-stage-actions');

            angular.element(stageAction).addClass('open');

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
          	var fromParentId = e.dataTransfer.getData('parentId');
      			var itemDrop = document.getElementById(e.dataTransfer.getData('elementId'));
      			var itemId = angular.element(itemDrop).attr('mx-id');
            var stageAction = document.getElementById('mx-stage-actions');

            this.classList.remove('over');

            angular.element(stageAction).removeClass('open');

            if (this.id == fromParentId) {
              return;
            }

      			if (e.stopPropagation) {
          		e.stopPropagation();
          	}

          	this.appendChild(itemDrop);

          	DataProvider.moveRecord(fromParentId, this.id, itemId);

          	controller.onDropHandler(itemId);

          	return false;
          },
          false
        );
      }
    };
  }]);
