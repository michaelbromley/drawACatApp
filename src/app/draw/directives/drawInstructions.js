/**
 * Created by Michael on 18/03/14.
 */

angular.module('drawACat.draw.directives')

    .directive('dacDrawInstructions', function(drawHelper) {

        var instructions = {
            head: 'Try to draw the outline of the head in one go. That way it\'ll get filled in. Don\'t forget the nose and whiskers too!',
            eyesOpen: 'The eyes should be somewhere on the head, and there should be two of them!',
            eyesClosed: 'Draw the closed eyes over the top of the open eyes - you should still see a faint outline of them.',
            mouthClosed: 'The mouth should go somewhere under the nose!',
            mouthOpen: 'Draw the open mouth over the closed mouth - you should still see a faint outline of it.',
            body: 'The body should include the hind legs and tail. Make sure the neck comes well above the chin (it\'ll be covered by the head anyway).',
            leftLeg: 'Try to draw the outline of the leg all in one go so it gets filled in.',
            rightLeg: 'Same with the right leg. Once you\'re done click "Save Cat"!'
        };

        return {
            restrict: 'E',
            templateUrl: 'draw/directives/drawInstructions.tpl.html',
            replace: true,
            link: function(scope) {
                scope.isFirstStep = true;
                scope.isLastStep = false;

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
                    scope.isFirstStep = (drawHelper.getCurrentPartKey() === 'head');
                    scope.isLastStep = (drawHelper.getCurrentPartKey() === 'rightLeg');
                });

            }
        };
    })
;

