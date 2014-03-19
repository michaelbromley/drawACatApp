/**
 * Created by Michael on 07/03/14.
 */

angular.module('drawACat.draw', [
        'ui.router',
        'drawACat.draw.directives',
        'drawACat.draw.services'
    ])

    .constant('DRAW_GUIDE_IMAGES', {
        head: 'assets/images/draw-guide-head.gif',
        eyesOpen: 'assets/images/draw-guide-eyes-open.gif',
        eyesClosed: 'assets/images/draw-guide-eyes-closed.gif',
        mouthClosed: 'assets/images/draw-guide-mouth-closed.gif',
        mouthOpen: 'assets/images/draw-guide-mouth-open.gif',
        body: 'assets/images/draw-guide-body.gif',
        leftLeg: 'assets/images/draw-guide-left-leg.gif',
        rightLeg: 'assets/images/draw-guide-right-leg.gif'
    })

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

    .controller('DrawController', function($scope, primitives, drawHelper, serializer, datastore, catBuilder) {
        $scope.catParts = drawHelper.catParts;
        $scope.steps = drawHelper.partKeys;
        $scope.currentStep = drawHelper.getCurrentPartKey();
        $scope.lineCollection = primitives.LineCollection();
        $scope.drawing = {
            completed: false,
            showGuide: true
        };
        $scope.showSaveDialog = false;

        $scope.undo = function() {
            $scope.lineCollection.removeLine();
        };

        function savePart() {
            var partName = $scope.currentStep;
            if (0 < $scope.lineCollection.count()) {
                $scope.catParts[partName].lineCollection = $scope.lineCollection;
                $scope.catParts[partName].done = true;
                $scope.drawing.completed = checkCompleted();
            } else {
                $scope.catParts[partName].done = false;
            }
        }
        function checkCompleted() {
            var result = true;
            angular.forEach($scope.catParts, function(catPart) {
                if (!catPart.done) {
                    result =  false;
                }
            });
            return result;
        }

        $scope.nextStep = function() {
            savePart();
            drawHelper.next();
            loadLineCollection();
        };
        $scope.previousStep = function() {
            savePart();
            drawHelper.previous();
            loadLineCollection();
        };
        function loadLineCollection() {
            if ($scope.catParts[drawHelper.getCurrentPartKey()].done === false) {
                // reset the lineCollection to an empty collection and move on to the next part to draw
                $scope.lineCollection = primitives.LineCollection();
            } else {
                $scope.lineCollection = $scope.catParts[drawHelper.getCurrentPartKey()].lineCollection;
            }
        }

        $scope.saveCat = function() {
            var finalCat = catBuilder.buildCatFromParts($scope.catParts);
            var serializedCat = serializer.serializeCat(finalCat);
            datastore.saveCat($scope.name, $scope.description, serializedCat);
        };

        $scope.$on("$destroy", function() {
            drawHelper.reset();
        });

    });