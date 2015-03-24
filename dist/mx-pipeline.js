angular.module('mxPipeline.templates', []).run(['$templateCache', function($templateCache) {
  $templateCache.put("template/mxpipeline.tpl.html",
    "<div class=mx-pipeline><table class=mx-stage><tbody><tr height=45><td><div class=mx-header><ul><li id=\"stage-{{ column[mxFieldColumnKey] }}\" ng-repeat=\"column in mxDataProvider\"><span class=mx-name>{{ column[\"name\"] }}</span> <span class=mx-stage-value><span class=mx-value>{{ vm.sumValues(column[mxFieldChildren]) | currency:'R$ ' }} <small>{{ column[mxFieldChildren] | countItem:true }}</small></span></span></li></ul></div></td></tr><tr><td><div class=mx-container><table class=mx-table-content><tbody><tr><td class=mx-stage-item ng-repeat=\"column in mxDataProvider\"><ul id=\"{{ column[mxFieldColumnKey] }}\" mx-droppable><li id=\"mx-pipeline-key-{{ item[mxFieldChildKey] }}\" mx-id=\"{{ item[mxFieldChildKey] }}\" class=item ng-repeat=\"item in column[mxFieldChildren]\" mx-draggable><div class=mx-card><a href=\"\" class=mx-click-card draggable=false><strong><img ng-src=\"{{ item[mxFieldChildIcon] === undefined ? 'img/profile_120x120.jpg' : item[mxFieldChildIcon] }}\" alt=\"{{ item[mxFieldChildName] }}\" class=mx-profile-icon> {{ item[mxFieldChildName] }}</strong> <small><span class=detail>{{ item[mxFieldChildValue] | currency:'R$ ' }}</span> <span class=detail>{{ item[mxFieldChildPartner] }}</span></small></a></div><div class=mx-icon-card draggable=false ng-class=\"{'state-0': item[mxFieldChildState] == '0', 'state-1': item[mxFieldChildState] == 1, 'state-2': item[mxFieldChildState] == 2, 'state-3': item[mxFieldChildState] == 3, 'state-4': item[mxFieldChildState] == 4}\"><a id=activity-item-click href=\"\" class=icon ng-click=\"vm.stateClickHandler($event, item[mxFieldChildKey])\"></a></div></li></ul></td></tr></tbody></table><div id=mx-stage-actions><ul class=mx-stage-action><li class=mx-trash mx-droppable-action mx-droppable-type=trash><span></span></li><li class=mx-lose mx-droppable-action mx-droppable-type=lose><span>Perdido</span></li><li class=mx-win mx-droppable-action mx-droppable-type=win><span>Ganho</span></li></ul></div></div></td></tr></tbody></table></div>");
}]);

/**
 * @ngdoc overview
 * @name mxPipeline
 * @description
 * # mxPipeline
 *
 * Main module of the application.
 */
angular.module('mxPipeline', ['mxPipeline.templates']);
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

/**
 * @ngdoc service
 * @name mxPipeline.DataProvider
 * @description
 * # DataProvider
 * Service in the mxPipeline.
 */
angular.module('mxPipeline')
  .service('DataProvider', function () {
    var vm = this;
    var dataProvider;
    var fieldColumnId;
    var fieldColumnChildren;
    var fieldChildId;

    vm.setFieldColumnId = function setFieldColumnId(field) {
    	fieldColumnId = field;
    };

    vm.setFieldColumnChildren = function setFieldColumnChildren(field) {
    	fieldColumnChildren = field;
    };

    vm.setFieldChildId = function setFieldColumnId(field) {
    	fieldChildId = field;
    };

    vm.set = function set(dp) {
    	dataProvider = dp;
    };

    vm.get = function get() {
    	return dataProvider;
    };

    vm.moveRecord = function moveRecord(fromStageId, toStageId, childId) {
   		var indexRemove;
   		var currentData;
   		var toData;

	    dataProvider.forEach(function(record, index){
    		if (record[fieldColumnId] === fromStageId) {

    			if (angular.isDefined(record[fieldColumnChildren])) {
        			record[fieldColumnChildren].forEach(function(child, index){
        				if (child[fieldChildId] === childId) {
        					indexRemove = index;

        					currentData = child;
        				}
        			});

        			if (angular.isDefined(indexRemove)) {
        				record[fieldColumnChildren].splice(indexRemove, 1);
        			}
    			}
    		} else if (record[fieldColumnId] === toStageId) {
			    toData = record;
    		}
    	});

    	if (angular.isDefined(toData)) {
    		if (!angular.isDefined(toData[fieldColumnChildren])) {
    			toData[fieldColumnChildren] = [];
    		}

    		toData[fieldColumnChildren].push(currentData);
    	}
    };

    vm.removeRecord = function moveRecord(fromStageId, childId) {
      var indexRemove;

      dataProvider.forEach(function(record, index){
        if (record[fieldColumnId] === fromStageId) {

          if (angular.isDefined(record[fieldColumnChildren])) {
              record[fieldColumnChildren].forEach(function(child, index){
                if (child[fieldChildId] === childId) {
                  indexRemove = index;
                }
              });

              if (angular.isDefined(indexRemove)) {
                record[fieldColumnChildren].splice(indexRemove, 1);
              }
          }
        }
      });
    };
  });

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

        elem.draggable = true;

        elem.addEventListener(
          'dragstart', 
          function(e) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('parentId', this.parentNode.id);
            e.dataTransfer.setData('elementId', this.id);

            this.classList.add('drag');

            return false;
          },
          false
        );

        elem.addEventListener(
          'dragend',
          function(e) {
            this.classList.remove('drag');
            return false;
          },
          false
        );

        elem.addEventListener(
          'click',
          function(e){
            itemId = angular.element(this).attr('mx-id');

            controller.itemClickHandler(itemId);

            return false;
          },
          false
        );
      }
    };
  });

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
            this.classList.remove('open');

      		if (e.stopPropagation) {
          		e.stopPropagation();
          	}

          	fromParent.removeChild(itemDrop);

          	DataProvider.removeRecord(fromParentId, itemId);

          	console.log(DataProvider.get());

          	//controller.onDropHandler(itemId);

          	return false;
          },
          false
        );
      }
    };
  }]);

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