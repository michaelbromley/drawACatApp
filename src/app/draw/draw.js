/**
 * Created by Michael on 07/03/14.
 */

angular.module('drawACat.draw', [
        'ui.state',
        'drawACat.draw.directives'
    ])

    .config(function config( $stateProvider ) {
      $stateProvider.state( 'draw', {
        url: '/cat/new',
        views: {
          "main": {
            controller: 'drawController',
            templateUrl: 'draw/draw.tpl.html'
          }
        },
        data:{ pageTitle: 'Home' }
      });
    })

    .controller('drawController', function($scope, primitives, renderer) {

        $scope.lineCollection = primitives.LineCollection();

        $scope.partCollection = primitives.PartCollection();

        $scope.addNewPart = function(name) {
            var newPart = primitives.Part();
            newPart.createFromPath(name, $scope.lineCollection.getPath());
            $scope.partCollection.addPart(newPart);

            // reset the lineCollection to an empty collection
            $scope.lineCollection = primitives.LineCollection();
        };

    })


;