angular.module("solr-discovery")
.controller('FacetListController', function (Item, $scope) {
	function updateItems() {
		Item.get({q: $scope.search}).$promise.then(function (items) { 
				$scope.items = items;
				var authors = [];
				var currentItem;
				for (var i = 0; i < items.facet_counts.facet_fields.author_keyword.length; i++) {
					var item = items.facet_counts.facet_fields.author_keyword[i];
					if (i % 2 === 0) {
						currentItem = {
							author: item
						};
						authors.push(currentItem);
					} else {
						currentItem.count = item;
					}
				}
				items.authors = authors;
				console.log("Querying");
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
