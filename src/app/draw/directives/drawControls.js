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
                lineCollection: '='
            },
            link: function(scope, element) {
                scope.undo = function() {
                    scope.lineCollection.removeLine();
                };
            }
        };
    });