/**
 * Created by Michael on 29/04/14.
 */



angular.module('drawACat.home.previewPanel', [])

.directive('dacPreviewPanel', function() {

    return {
        restrict: 'AE',
        templateUrl: 'home/directives/previewPanel.tpl.html',
        scope: {},
        link: function(scope, element, attrs) {

        }
    };
});
