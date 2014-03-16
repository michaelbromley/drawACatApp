/**
 * Created by Michael on 07/03/14.
 */

angular.module('drawACat.draw', [
        'ui.state',
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

    .controller('DrawController', function($scope, primitives, catFactory, behaviourFactory, drawHelper, serializer, datastore) {

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
         * Takes the "raw" form of the cat that was just drawn, and processes it into a form suitable for saving.
         * @param rawCat
         * @returns {*}
         */
        var normalizeCat = function(rawCat) {
            var minX = rawCat.getBoundaries('x').min;
            var minY = rawCat.getBoundaries('y').min;

            var normalCat = catFactory.newCat();

            angular.forEach(drawHelper.catParts, function(partTemplate, partName) {
                var partPath = rawCat.bodyParts[partName].part.getPath();
                var normalizedPath = normalizePath(partPath, minX, minY);

                var newPart = primitives.Part();
                newPart.createFromPath(partName, normalizedPath);
                normalCat.bodyParts[partName].part = newPart;

                var newBehaviour = behaviourFactory.newBehaviour();
                newBehaviour = applyBehaviourTemplate(newBehaviour, partTemplate.behaviour);
                normalCat.bodyParts[partName].behaviour = newBehaviour;
            });

            // now we need to loop through the bodyParts once more to resolve the parent/child relationships
            angular.forEach(drawHelper.catParts, function(partTemplate, partName) {
                if(partTemplate.parentPart) {
                    normalCat.bodyParts[partName].part.setParent(normalCat.bodyParts[partTemplate.parentPart].part);
                }
            });

            return normalCat;
        };

        /**
         * Make the cat's path origin start from coordinate 0,0. This will allow us to properly position the cat when it is
         * subsequently rendered. In this step we also halve the number of points in the path.
         *
         * @param partPath
         * @param minX
         * @param minY
         * @returns {*|Array}
         */
        var normalizePath = function(partPath, minX, minY) {
            return partPath.map(function(line) {
                return line
                    .filter(function(point, index) {
                        // filter out every other element (starting from the second element) to reduce the amount of
                        // data to be stored. Has no visible effect of the rendered shapes, but halves the storage space required
                        // and vastly speeds up rendering.
                        return (index + 1) % 2 === 0;
                    })
                    .map(function(point) {
                        // subtract the minX and minY values from each coordinate so that the cat is aligned to the top left
                        // of the x/y origin point.
                        return [
                            point[0] - minX,
                            point[1] - minY
                        ];
                    });
            });
        };


        var applyBehaviourTemplate = function(newBehaviour, templateBehaviour) {
            if (templateBehaviour) {
                if (templateBehaviour.sensitivity) {
                    newBehaviour.setSensitivity(templateBehaviour.sensitivity);
                }
                if (templateBehaviour.range) {
                    newBehaviour.range = templateBehaviour.range;
                }
                if (templateBehaviour.visible) {
                    newBehaviour.visible = templateBehaviour.visible;
                }
            }

            return newBehaviour;
        };

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
            var finalCat = normalizeCat($scope.cat);

            var serializedCat = serializer.serializeCat(finalCat);

            datastore.saveCat($scope.name, $scope.description, serializedCat);
        };

        $scope.$on("$destroy", function() {
            drawHelper.reset();
        });

    });