angular.module("solr-discovery")
.controller('FacetListController', function (Item, $scope) {
	function updateItems() {
		Item.get({q: $scope.search}).$promise.then(function (items) { 
			$scope.items = items;
		});
	}
	
	$scope.updateItems = updateItems;
	
	$scope.$watch("search", function () {
		updateItems();
	})
})
.factory("Item", function ($resource) {
	return $resource("items");
})
