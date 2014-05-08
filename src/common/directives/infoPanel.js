/**
 * Created by Michael on 26/04/14.
 */

angular.module('drawACat.common.directives')

    .directive('dacInfoPanel', function($timeout, $window) {

        return {
            restrict: 'AE',
            templateUrl: 'directives/infoPanel.tpl.html',
            replace: true,
            transclude: true,
            scope: true,
            link: function(scope, element, attrs) {
                scope.infoPanelVisible = true;

                scope.toggleInfoPanel = function() {
                    if (scope.infoPanelVisible) {
                        contract();
                    } else {
                        expand();
                    }
                };
                $timeout(contract, 5000);

                angular.element($window).bind('resize', function() {
                    if (!scope.infoPanelVisible) {
                        contract();
                    }
                });

                function contract() {
                    var panelHeight = element[0].offsetHeight;
                    element.css('top', -panelHeight + 40 + 'px');
                    scope.infoPanelVisible = false;
                }

                function expand() {
                    element.css('top', null);
                    scope.infoPanelVisible = true;
                }
            }
        };
    });