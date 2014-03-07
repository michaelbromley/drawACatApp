/**
 * Created by Michael on 07/03/14.
 */

angular.module('drawACat.common.services.renderer', [])

    .factory('renderer', function() {

        var context;

        var Renderer = function(canvasElement) {
            context = canvasElement.getContext('2d');
        };

        Renderer.prototype.drawStart = function(x, y) {
            context.beginPath();
            context.moveTo(x, y);
        };

        Renderer.prototype.drawMove = function(x, y) {
            context.lineTo(x, y);
            context.stroke();
        };

        Renderer.prototype.clearCanvas = function() {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        };

        Renderer.prototype.renderPath = function(path) {

            var renderLine = function(line) {
                context.moveTo(line[0][0], line[0][1]);

                for (var point = 1; point < line.length; point ++) {
                    context.lineTo(line[point][0], line[point][1]);
                    context.stroke();
                }
            };

            context.beginPath();
            for (var line = 0; line < path.length; line ++) {
                renderLine(path[line]);
            }
        };

        return {
            Init: function(canvasElement) {
                return new Renderer(canvasElement);
            }
        };
    });
