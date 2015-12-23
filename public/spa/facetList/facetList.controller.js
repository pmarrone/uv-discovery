angular.module("solr-discovery")
.controller('FacetListController', function (Item, Hierarcy, $scope) {
	$scope.filters = {

	}
	function updateItems() {
		Item.get({q: $scope.search, filters: $scope.filters }).$promise.then(function (items) { 
			function removePrefix(path) {
				var pathParts = path.split("\n|||\n");
				return pathParts[pathParts.length - 1];
			}

			function removePrefixRecursive(pivot) {
				pivot.forEach(function (item) {
					item.path = item.value;
					item.value = removePrefix(item.value);
					if (item.pivot) {
						removePrefixRecursive(item.pivot);
					}
				});
			}

			$scope.items = items;
			$scope.pivot = removePrefixRecursive(items.facet_counts.facet_pivot['location.path_1_s,location.path_2_s,location.path_3_s']);
		});

		//$scope.hierarcy = Hierarcy.get();
	}
	
	$scope.updateItems = updateItems;
	$scope.filterQuery = function(item) {
		$scope.filters[item.field] = item.path;
		updateItems();
	};
	
	$scope.$watch("search", function () {
		updateItems();
	})

	$scope.$watchCollection("filters", function () {
		updateItems();
	})
})
.factory("Item", function ($resource) {
	return $resource("api/items");
})
.factory("Hierarcy", function ($resource) {
	return $resource("api/hierarcy");
});
