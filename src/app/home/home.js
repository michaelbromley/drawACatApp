
angular.module( 'drawACat.home', [
        'drawACat.home.filters',
        'ui.router'
])


.config(function config( $stateProvider ) {
  $stateProvider.state( 'home', {
    url: '/home',
    views: {
      "main": {
        controller: 'HomeController',
        templateUrl: 'home/home.tpl.html'
      }
    },
    data:{ pageTitle: 'Draw A Cat!' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'HomeController', function HomeController( $scope, datastore ) {

        datastore.listCats().success(function(data) {
            $scope.cats = data;
        });

        datastore.getTags().then(function(data) {
            $scope.tags = data;
        });

        $scope.searchInput = "";
        $scope.tagsArray = [];
        $scope.filterByTags = function() {
            var regexp = /#([a-zA-Z0-9_]+)/g;
            $scope.tagsArray = [];
            var match;
            while (match = regexp.exec($scope.searchInput)) {
                $scope.tagsArray.push(match[1]);
            }
        };
    })

;

