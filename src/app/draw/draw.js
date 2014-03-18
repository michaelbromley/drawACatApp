/**
 * Created by Michael on 07/03/14.
 */

angular.module('drawACat.draw', [
        'ui.router',
        'drawACat.draw.directives',
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
         * Scope properties
         */
        $scope.catParts = drawHelper.catParts;
        $scope.steps = drawHelper.partKeys;
        $scope.currentStep = drawHelper.getCurrentPartKey();
        $scope.lineCollection = primitives.LineCollection();
        $scope.cat = catFactory.newCat();
        $scope.completed = false;

        /**
         * Scope methods
         */
        $scope.undo = function() {
            $scope.lineCollection.removeLine();
        };

        $scope.savePart = function() {
            var partName = $scope.currentStep;
            var newPart = primitives.Part();
            newPart.createFromPath(partName, $scope.lineCollection.getPath());
            $scope.cat.bodyParts[partName].part = newPart;
            $scope.catParts[partName].done = true;

            // reset the lineCollection to an empty collection and move on to the next part to draw
            $scope.lineCollection = primitives.LineCollection();
            drawHelper.next();
        };

        $scope.nextStep = function() {
            drawHelper.next();
        };
        $scope.previousStep = function() {
            drawHelper.previous();
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