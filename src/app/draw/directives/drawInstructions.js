/**
 * Created by Michael on 18/03/14.
 */

angular.module('drawACat.draw.directives')

    .directive('dacDrawInstructions', function(drawHelper) {

        var instructions = {
            head: 'Try to draw the outline of the head in one go. That way it\'ll get filled in. Don\'t forget the nose and whiskers too!',
            eyesOpen: 'eyes open instructions',
            eyesClosed: 'eyes closed instructions',
            mouthClosed: 'mouth closed instructions',
            mouthOpen: 'mouth open instructions',
            body: 'body instructions',
            leftLeg: 'left leg instructions',
            rightLeg: 'right leg instructions'
        };

        return {
            restrict: 'E',
            templateUrl: 'draw/directives/drawInstructions.tpl.html',
            replace: true,
            link: function(scope) {
                var showInstructions = function() {
                    scope.currentStepLabel = drawHelper.getCurrentPartLabel();
                    scope.currentStep = drawHelper.getCurrentPartKey();
                    scope.instruction = instructions[scope.currentStep];
                };
                showInstructions();

                scope.$watch(function() {
                    return drawHelper.getCurrentPartKey();
                }, function() {
                    showInstructions();
                });

            }
        };
    })
;

