/**
 * Created by Michael on 28/03/14.
 */
angular.module('drawACat.cat.directives')

    .directive('facebookButton', function($location, ezfb) {

        return {
            restrict: 'AE',
            template: '<div class="fb-like" data-href="{{ url }}" data-layout="button_count"></div>',
            link: function(scope, element) {
                scope.url = $location.absUrl();

                ezfb.Event.subscribe('edge.create', function() {
                    scope.rateCat();
                });
            }
        };
    });