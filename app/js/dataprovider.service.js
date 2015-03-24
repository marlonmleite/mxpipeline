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
