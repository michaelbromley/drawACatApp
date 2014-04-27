/**
 * Created by Michael on 26/04/14.
 */

angular.module('drawACat.cat.directives')

.directive('dacCommentsLink', function($window) {

    return {
        restrict: 'AE',
        templateUrl: 'cat/directives/commentsLink.tpl.html',
        scope: true,
        link: function(scope) {
            scope.isTop = true;

            scope.$watch(function() {
                return $window.scrollY;
            }, function(newVal) {
                if (0 < newVal) {
                    scope.isTop = false;
                } else {
                    scope.isTop = true;
                }
            });

            scope.scrollToTarget = function() {
                if (scope.isTop) {
                    var comments = document.getElementById('comments');
                    $window.scrollTo(0, comments.offsetTop);
                } else {
                    $window.scrollTo(0, 0);
                }
            };
        }
    };
});