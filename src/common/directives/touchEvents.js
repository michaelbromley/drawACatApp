/**
 * Created by Michael on 17/03/14.
 */
angular.module('drawACat.common.directives')
/**
 * Directives that incorporate Hammer.js events to make the element respond to both mouse and touch input.
 */
    .directive('dacPointerstart', function($parse) {
        return {
            restrict: 'A',
            compile: function($element, attr) {
                var fn = $parse(attr['dacPointerstart']);
                return function(scope, element, attr) {
                    Hammer(element[0], { prevent_default: true }).on('touch', function(event) {
                        event = event.gesture;
                        if (!event.clientX && event.touches) {
                            var propertiesToCopy = [
                                'clientX',
                                'clientY',
                                'screenX',
                                'screenY',
                                'pageX',
                                'pageY'
                            ];
                            for (var prop = 0; prop < propertiesToCopy.length; prop ++) {
                                event[propertiesToCopy[prop]] = event.touches[0][propertiesToCopy[prop]];
                            }
                        }
                        scope.$apply(function() {
                            fn(scope, {$event:event});
                        });
                    });
                };
            }
        };
    })
 .directive('dacPointermove', function($parse) {
        return {
            restrict: 'A',
            compile: function($element, attr) {
                var fn = $parse(attr['dacPointermove']);
                return function(scope, element, attr) {
                    Hammer(element[0], { prevent_default: true }).on('drag', function(event) {
                        event = event.gesture;
                        if (!event.clientX && event.touches) {
                            var propertiesToCopy = [
                                'clientX',
                                'clientY',
                                'screenX',
                                'screenY',
                                'pageX',
                                'pageY'
                            ];
                            for (var prop = 0; prop < propertiesToCopy.length; prop ++) {
                                event[propertiesToCopy[prop]] = event.touches[0][propertiesToCopy[prop]];
                            }
                        }
                        scope.$apply(function() {
                            fn(scope, {$event:event});
                        });
                    });
                };
            }
        };
    })
 .directive('dacPointerend', function($parse) {
        return {
            restrict: 'A',
            compile: function($element, attr) {
                var fn = $parse(attr['dacPointerend']);
                return function(scope, element, attr) {
                    Hammer(element[0], { prevent_default: true }).on('release', function(event) {
                        scope.$apply(function() {
                            fn(scope, {$event:event});
                        });
                    });
                };
            }
        };
    })


;