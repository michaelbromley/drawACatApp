/**
 * Created by Michael on 28/03/14.
 */
angular.module('drawACat.cat.directives')

    .directive('facebookButton', function($location, $window) {

        return {
            restrict: 'AE',
            template: '<div class="fb-share-button" data-href="{{ url }}" data-type="button_count"></div>',
            link: function(scope, element) {
                scope.url = $location.absUrl();
            }
        };
    });