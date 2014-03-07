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

    .controller('drawController', function($scope, primitives) {

        $scope.lineCollection = primitives.LineCollection();

    })


;