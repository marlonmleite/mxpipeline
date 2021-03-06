/**
 * @ngdoc directive
 * @name mxPipeline.directive:mxDraggable
 * @description
 * # mxDraggable
 */
angular.module('mxPipeline')
  .directive('mxDraggable', function () {
    return {
      require: '^mxPipeline',
      restrict: 'A',
      link: function postLink(scope, element, attrs, controller) {
        var elem = element[0];
        var itemId;
        var stageAction = document.getElementById('mx-stage-actions');

        elem.draggable = true;

        elem.addEventListener(
          'dragstart', 
          function(e) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('parentId', this.parentNode.id);
            e.dataTransfer.setData('elementId', this.id);

            this.classList.add('drag');
            angular.element(stageAction).addClass('open');

            return false;
          },
          false
        );

        elem.addEventListener(
          'dragend',
          function(e) {
            this.classList.remove('drag');

            angular.element(stageAction).removeClass('open');

            return false;
          },
          false
        );

        elem.addEventListener(
          'click',
          function(e){
            itemId = angular.element(this).attr('mx-id');

            controller.itemClickHandler(itemId, e);

            return false;
          },
          false
        );
      }
    };
  });
