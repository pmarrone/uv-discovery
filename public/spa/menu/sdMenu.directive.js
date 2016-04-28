angular.module("solr-discovery").directive("sdMenu", function () {
	return {
		restrict: "E",
		scope: {
			items: "=items",
			filterQuery: "=",
			filters: '=',
			field: '@'
		},
		templateUrl: "spa/menu/menu.html",
		controller: function ($scope) {
			$scope.collapsed = true;

			$scope.isActive = function(item) {
				return $scope.filters[$scope.field] == item.key;
			}

			$scope.removeFilter = function(item) {
				if ($scope.isActive(item)) {
					delete $scope.filters[$scope.field];
				}
			}
		}
	}
})