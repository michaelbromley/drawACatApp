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

    .controller('drawController', function($scope, primitives, drawHelper) {

        $scope.catParts = drawHelper.catParts;
        $scope.currentPart = drawHelper.getCurrentPart();

        $scope.lineCollection = primitives.LineCollection();

        $scope.partCollection = primitives.PartCollection();

        $scope.undo = function() {
            $scope.lineCollection.removeLine();
        };
        $scope.addNewPart = function(name) {
            var newPart = primitives.Part();
            newPart.createFromPath(name, $scope.lineCollection.getPath());
            $scope.partCollection.addPart(newPart);

            // reset the lineCollection to an empty collection
            $scope.lineCollection = primitives.LineCollection();
        };

    })

.factory('drawHelper', function() {

        var catParts = {
            head: {
                label: 'Head'
            },
            eyesOpen: {
                label: 'Eyes Open'
            },
            eyesClosed: {
                label: 'Eyes Closed'
            },
            body: {
                label: 'Body'
            },
            leftLeg: {
                label: 'Left Leg'
            },
            rightLeg: {
                label: 'Right Leg'
            }
        };
        var partKeys = Object.keys(catParts);
        var currentPartIndex = 0;

        return {
            catParts: catParts,
            getCurrentPart: function() {
                var currentPartKey = partKeys[currentPartIndex];
                return catParts[currentPartKey].label;
            }
        };
    })


;