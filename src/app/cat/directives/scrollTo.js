/**
 * Created by Michael on 27/04/14.
 *
 * Uses elements from https://github.com/arnaudbreton/angular-smoothscroll
 */

angular.module('drawACat.cat.directives')
.directive('dacScrollTo', function($window, $timeout) {

    return {
        restrict: 'AE',
        templateUrl: '',
        link: function(scope, element, attrs) {

            var target = attrs.dacScrollTo;

            function currentYPosition() {
                if ($window.pageYOffset) {
                    return $window.pageYOffset;
                }
                if ($window.document.documentElement && $window.document.documentElement.scrollTop) {
                    return $window.document.documentElement.scrollTop;
                }
                if ($window.document.body.scrollTop) {
                    return $window.document.body.scrollTop;
                }
                return 0;
            }

            function targetYPosition() {
                var elm, node, y;
                if (target === 'top') {
                    return 0;
                }
                elm = document.getElementById(target);
                if (elm) {
                    y = elm.offsetTop;
                    node = elm;
                    while (node.offsetParent && node.offsetParent !== document.body) {
                        node = node.offsetParent;
                        y += node.offsetTop;
                    }
                    return y;
                } else {
                    return 0;
                }
            }

            function scrollToTarget(duration, callback) {
                duration = duration || 1000; // default to 1 second
                callback = callback || angular.noop;

                var startingPosition = currentYPosition();
                var endingPosition = targetYPosition();
                var distance = startingPosition - endingPosition;
                var timeLapsed = 0;
                var progress, yOffset;

                var animateScroll = function() {
                    timeLapsed += 16;
                    progress = ( timeLapsed / duration );
                    progress = ( progress > 1 ) ? 1 : progress;
                    yOffset = startingPosition - (distance * Math.pow(progress, 3)); // a basic cubic easing function
                    $window.scroll(0, yOffset);
                    if (yOffset !== endingPosition) {
                        $timeout(animateScroll, 16);
                    } else {
                        if (typeof callback === 'function') {
                            callback();
                        }
                    }
                };
                animateScroll();
            }

            element.on('click', function() {
                scrollToTarget(500);
            });
        }
    };
});