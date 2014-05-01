/**
 * Created by Michael on 29/04/14.
 */



angular.module('drawACat.home.previewPanel', [])

    .directive('dacPreviewPanel', function($rootScope) {

        return {
            restrict: 'AE',
            templateUrl: 'home/directives/previewPanel.tpl.html',
            scope: {
                cat: '='
            },
            link: function(scope, element, attrs) {
                var container = angular.element(document.getElementById('preview-container'));
                var floater = angular.element(element[0].querySelector('.floater'));
                var overlay = angular.element(document.getElementById('overlay'));

                scope.showInfo = "";

                scope.clickHandler = function() {
                    $rootScope.$broadcast('preview-click', scope.cat.id);
                    if (scope.showInfo === "") {
                        enable();
                    } else {
                        disable();
                    }
                };

                scope.$on('preview-click', function(event, id) {
                    if (scope.showInfo !== "" && id !== scope.cat.id) {
                        disable();
                    }
                });

                function enable() {
                    scope.showInfo = "show-info";
                    container.addClass('recessed');
                    floater.addClass('float');
                    overlay.addClass('displaying');
                }

                function disable() {
                    scope.showInfo = "";
                    container.removeClass('recessed');
                    floater.removeClass('float');
                    overlay.removeClass('displaying');
                }
            }
        };
    });
