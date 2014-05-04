/**
 * Created by Michael on 29/04/14.
 */



angular.module('drawACat.home.previewPanel', [])

    .directive('dacPreviewPanel', function($rootScope, $location, $timeout, previewPanelService) {

        return {
            restrict: 'AE',
            templateUrl: 'home/directives/previewPanel.tpl.html',
            scope: {
                cat: '='
            },
            link: function(scope, element, attrs) {
                var previewPanel = angular.element(element[0].querySelector('.preview-panel'));
                var overlay = angular.element(document.getElementById('overlay'));

                scope.showInfo = "";
                scope.isSelected = false;

                scope.clickHandler = function() {
                    previewPanelService.currentlySelected = scope.cat.id;
                    $rootScope.$broadcast('preview-click');

                    if (!scope.isSelected) {
                        if (previewPanelService.switching) {
                            $timeout(enable, 600);
                        } else {
                            enable();
                        }
                    } else {
                        disable();
                    }
                };

                scope.$on('preview-click', function(event, closeAll) {
                    if (scope.isSelected) {
                        if (scope.cat.id !== previewPanelService.currentlySelected || closeAll){
                            previewPanelService.switching = true;
                            disable();
                        }
                    }
                });

                scope.tagClick = function(tag) {
                    $location.search('tags', tag);
                };

                function enable() {
                    previewPanelService.switching = false;
                    scope.isSelected = true;
                    scope.showInfo = "show-info";
                    previewPanel.addClass('selected');
                    overlay.addClass('displaying');
                }

                function disable() {
                    scope.isSelected = false;
                    scope.showInfo = "";
                    previewPanel.removeClass('selected');
                    overlay.removeClass('displaying');
                }
            }
        };
    })
    .service('previewPanelService', function() {
        this.switching = false;
        this.currentlySelected = null;
    })
;
