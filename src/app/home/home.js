
angular.module( 'drawACat.home', [
        'ui.state'
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
    data:{ pageTitle: 'Home' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'HomeController', function HomeController( $scope, datastore ) {

        datastore.listCats().success(function(data) {
            $scope.cats = data;
        });
})

;

