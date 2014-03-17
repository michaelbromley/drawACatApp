/**
 * Created by Michael on 07/03/14.
 */

angular.module('drawACat.draw', [
        'ui.router',
        'drawACat.draw.canvas',
        'drawACat.draw.services'
    ])
    .config(function config( $stateProvider ) {
      $stateProvider.state( 'draw', {
        url: '/cat/new',
        views: {
          "main": {
            controller: 'DrawController',
            templateUrl: 'draw/draw.tpl.html'
          }
        },
        data:{ pageTitle: 'Home' }
      });
    })

    .controller('DrawController', function($scope, primitives, catFactory, behaviourFactory, drawHelper, serializer, datastore, catNormalizer) {

        /**
         * Private methods and variables
         */
        var showInstructions = function() {
            var currentPartLabel =  drawHelper.getCurrentPartLabel();

            if (currentPartLabel != 'end') {
                $scope.currentPartLabel = currentPartLabel;
            } else {
                $scope.completed = true;
            }
        };
        showInstructions();

        /**
         * Scope properties
         */
        $scope.catParts = drawHelper.catParts;
        $scope.lineCollection = primitives.LineCollection();
        $scope.cat = catFactory.newCat();
        $scope.completed = false;


        /**
         * Scope methods
         */
        $scope.undo = function() {
            $scope.lineCollection.removeLine();
        };

        $scope.addNewPart = function() {
            var partName = drawHelper.getCurrentPartKey();
            var newPart = primitives.Part();
            newPart.createFromPath(partName, $scope.lineCollection.getPath());
            $scope.cat.bodyParts[partName].part = newPart;

            // reset the lineCollection to an empty collection and move on to the next part to draw
            $scope.lineCollection = primitives.LineCollection();
            drawHelper.next();
            showInstructions();
        };

        $scope.saveCat = function() {
            var finalCat = catNormalizer.normalize($scope.cat);
            var serializedCat = serializer.serializeCat(finalCat);
            datastore.saveCat($scope.name, $scope.description, serializedCat);
        };

        $scope.$on("$destroy", function() {
            drawHelper.reset();
        });

    });