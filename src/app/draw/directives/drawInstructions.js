/**
 * Created by Michael on 18/03/14.
 */

angular.module('drawACat.draw.directives')

    .directive('dacDrawInstructions', function(drawHelper) {
        return {
            restrict: 'E',
            templateUrl: 'draw/directives/drawInstructions.tpl.html',
            replace: true,
            link: function(scope, element) {
                var showInstructions = function() {
                    var currentStepLabel =  drawHelper.getCurrentPartLabel();
                    if (currentStepLabel != 'end') {
                        scope.currentStepLabel = currentStepLabel;
                        scope.currentStep = drawHelper.getCurrentPartKey();
                    } else {
                        scope.completed = true;
                    }
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

