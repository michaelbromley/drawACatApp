/**
 * Created by Michael on 19/03/14.
 */

angular.module('drawACat.common.directives')

.directive('dacModalDialog', function() {
        return {
            restrict: 'E',
            templateUrl: 'directives/modalDialog.tpl.html',
            transclude: true,
            scope: {
                show: '='
            },
            link: function(scope) {
                scope.hideModal = function() {
                    scope.show = false;
                };
            }
        };
    });