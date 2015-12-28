angular.module("solr-discovery")
.controller('FacetListController', function (Item, $scope) {
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
      console.log(items); 
      var pivots = items.facet_counts.facet_pivot;

      for (var pivot in pivots) {
        if (pivots.hasOwnProperty(pivot)) {
          removePrefixRecursive(pivots[pivot]);
        }
      }
    });

  }
  
  $scope.updateItems = updateItems;
  $scope.filterQuery = function(item) {
    $scope.filters[item.field] = item.path;
    updateItems();
  };

  $scope.removeFilter = function(item) {
    delete $scope.filters[item];
  }
  
  $scope.$watch("search", function () {
    updateItems();
  })

  $scope.$watchCollection("filters", function () {
    updateItems();
  })
})
.factory("Item", function ($resource) {
  return $resource("api/items");
}).filter("replaceSeparator", function() {
  return function(input) {
    return input.replace(/\n\|\|\|\n/g, " / ");
  }
});
