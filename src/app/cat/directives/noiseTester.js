/**
 * Created by Michael on 13/03/14.
 */

angular.module('drawACat.cat.directives')

/**
 * This is a directive to test out the perlinNoise service in a visual and interactive way.
 */
.directive('noiseTester', function(perlinNoise) {
        var context;
        var width;
        var height;

        var drawAxes = function() {
            height = context.canvas.height;
            width = context.canvas.width;

            var origin = {
                x: 10,
                y: height - 10
            };

            // x axis
            context.beginPath();
            context.moveTo(origin.x, origin.y);
            context.lineTo(origin.x + width - 20, origin.y);
            context.stroke();

            // y axis
            context.moveTo(origin.x, origin.y);
            context.lineTo(origin.x, origin.y - (height - 20));
            context.stroke();
        };

        var drawLine = function(points) {
            context.clearRect(0, 0, width, height);

            drawAxes();
            context.beginPath();
            context.moveTo(translatePoint(points[0][0]), translatePoint(points[0][1]));

            for (var i = 1; i < points.length; i++) {
                var point = translatePoint(points[i]);
                context.lineTo(point[0], point[1]);
                context.stroke();
            }
        };

        var translatePoint = function(point){
            var x = (point[0] * 10) + 10;
            var y = height - 10 - (point[1] * height/2);
            return [x, y];
        };

        return {
            restrict: 'E',
            templateUrl: 'cat/directives/noiseTester.tpl.html',
            replace: true,
            link: function(scope, element) {
                var canvas = element.children()[0];
                context = canvas.getContext('2d');
                var noise = perlinNoise.newGenerator();
                scope.amplitude = 1;
                scope.scale = 1;
                var numSteps = 800;

                scope.$watch('amplitude', function(val) {
                    noise.setAmplitude(val);
                    renderNoise();
                });
                scope.$watch('scale', function(val) {
                    noise.setScale(val);
                    renderNoise();
                });

                var renderNoise = function() {
                    var points = [];
                    for ( var i = 0; i < numSteps; ++i ) {
                        var x = i/10;
                        var y = noise.getVal(x);
                        points.push([x, y]);
                    }
                    drawLine(points);
                };

            }
        };
    });