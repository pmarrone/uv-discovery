angular.module("solr-discovery").directive("sdMenu", function () {
	return {
		restrict: "E",
		scope: {
			items: "=items",
			filterQuery: "=",
			filters: '='
		},
		templateUrl: "spa/menu/menu.html",
		controller: function ($scope) {
			$scope.collapsed = true;

			$scope.isActive = function(item) {
				return $scope.filters[item.field] == item.path;
			}

			$scope.removeFilter = function(item) {
				if ($scope.isActive(item)) {
					delete $scope.filters[item.field];
				}
			}
		}
	}
})