/**
 * Created by Michael on 07/03/14.
 */

angular.module('drawACat.draw', [
        'ui.state',
        'drawACat.draw.canvas'
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

    .controller('drawController', function($scope, primitives, catFactory, behaviourFactory, drawHelper, serializer, datastore) {

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

            var newBehaviour = behaviourFactory.newBehaviour();
            if (drawHelper.catParts[drawHelper.getCurrentPartKey()].behaviour) {
                newBehaviour.setSensitivity(drawHelper.catParts[drawHelper.getCurrentPartKey()].behaviour.sensitivity);
            }

            $scope.cat.bodyParts[partName].part = newPart;
            $scope.cat.bodyParts[partName].behaviour = newBehaviour;

            // reset the lineCollection to an empty collection and move on to the next part to draw
            $scope.lineCollection = primitives.LineCollection();
            drawHelper.next();
            showInstructions();
        };

        $scope.saveCat = function() {
            // now we need to loop through the bodyParts once more to resolve the parent/child relationships
            angular.forEach(drawHelper.catParts, function(value, name) {
                if(value.parentPart) {
                    $scope.cat.bodyParts[name].part.setParent($scope.cat.bodyParts[value.parentPart].part);
                }
            });

            var serializedCat = serializer.serializeCat($scope.cat);

            datastore.saveCat($scope.name, $scope.description, serializedCat);
        };

    })

/**
 * This service is used to control the sequence in which the parts of the cat are drawn. It also contains pre-configured settings which are used to
 * set up the new cat instance.
 */
.factory('drawHelper', function() {

        var catParts = {
            head: {
                label: 'Head',
                behaviour:{
                    sensitivity: {
                        xSkew: 0.2,
                        ySkew: 0.2,
                        rotation: 0.1
                    }
                }
            },
            eyesOpen: {
                label: 'Eyes Open',
                parentPart: 'head'
            },
            eyesClosed: {
                label: 'Eyes Closed',
                parentPart: 'head',
                visible: false
            },
            mouthOpen: {
                label: 'Mouth Open',
                parentPart: 'head',
                visible: false
            },
            mouthClosed: {
                label: 'Mouth Closed',
                parentPart: 'head'
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
        var partKeys = [
            'head',
            'eyesOpen',
            'eyesClosed',
            'mouthOpen',
            'mouthClosed',
            'body',
            'leftLeg',
            'rightLeg'
        ];
        var currentPartIndex = 0;

        return {
            catParts: catParts,
            getCurrentPartLabel: function() {
                if (currentPartIndex < partKeys.length) {
                    var currentPartKey = partKeys[currentPartIndex];
                    return catParts[currentPartKey].label;
                } else {
                    return 'end';
                }
            },
            getCurrentPartKey: function() {
                if (currentPartIndex < partKeys.length) {
                return partKeys[currentPartIndex];
                } else {
                    return 'end';
                }
            },
            next: function() {
                currentPartIndex ++;
            }
        };
    })


;