/**
 * Created by Michael on 07/03/14.
 */

angular.module('drawACat.draw.directives')

    .directive('dacDrawControls', function() {
        return {
            restrict: 'E',
            templateUrl: 'draw/directives/drawControls.tpl.html',
            replace: true,
            scope: {
                lineCollection: '=',
                addMethod: '&'
            },
            link: function(scope, element) {
                scope.undo = function() {
                    scope.lineCollection.removeLine();
                };
                scope.save = function() {
                    scope.addMethod();
                    scope.partName = "";
                };
            }
        };
    });