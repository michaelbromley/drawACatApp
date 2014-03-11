/**
 * Created by Michael on 07/03/14.
 */

angular.module('drawACat.common.services')

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

        Renderer.prototype.renderCat = function(cat) {
            for (var key in cat.bodyParts) {
                if (cat.bodyParts.hasOwnProperty(key)) {
                    renderPartWithTransformations(cat.bodyParts[key].part);
                }
            }
        };

        var renderPartWithTransformations = function(part) {
            var path = part.getPath();
            var transformationData = part.getTransformationData();

            var coords;
            // the following vars are used to return the dimensions of the part path, which allows
            // the part to calculate it's mask box.
            var minX = 100000,
                maxX = 0,
                minY = 10000,
                maxY = 0;

            for (var line = 0; line < path.length; line ++) {

                context.beginPath();
                coords = applyTransformations(path[line], transformationData);
                context.moveTo(coords[0], coords[1]);

                for(var point = 0; point < path[line].length; point ++) {

                    // TODO: looking into how to make the line smoother - needs more work
                    //context.lineTo(points[i][0], points[i][1]);
                    //context.moveTo(points[i-2][0], points[i-2][1]);
                    /* var midX = (points[i][0] + points[i+1][0]) / 2;
                     var midY = (points[i][1] + points[i+1][1]) / 2;
                     context.quadraticCurveTo(points[i][0], points[i][1], midX, midY);*/
                    coords = applyTransformations(path[line][point], transformationData);
                    context.lineTo(coords[0], coords[1]);
                    context.stroke();

                    minX = coords[0] < minX ? coords[0] : minX;
                    minY = coords[1] < minY ? coords[1] : minY;
                    maxX = coords[0] > maxX ? coords[0] : maxX;
                    maxY = coords[1] > maxY ? coords[1] : maxY;
                }
            }

            return {
                minX: minX,
                maxX: maxX,
                minY: minY,
                maxY: maxY
            };
        };

        /**
         * Apply the all the current transforms:
         * - offset
         * - skew
         * - rotation
         * to the coordinates (x,y) and return the new, transformed coordinates.
         *
         * @param coords
         * @param transformationData
         * @returns {Array}
         */
        var applyTransformations = function(coords, transformationData) {

            var td = transformationData;
            var x = coords[0];
            var y = coords[1];

            // apply the offset
            x = x + td.xOffset;
            y = y + td.yOffset;
            var ppx = td.pivotPointX + td.xOffset;
            var ppy = td.pivotPointY + td.yOffset;

            // apply the skew
            var CANVAS_WIDTH = 500; // TODO: calculate dynamically
            var CANVAS_HEIGHT = 500; // TODO: calculate dynamically
            var skewPointX = ppx + td.xSkew;
            var skewPointY = ppy + td.ySkew;
            var xFromSkew = x - skewPointX;
            var yFromSkew = y - skewPointY;
            var distanceToSkewPoint = Math.sqrt(Math.pow(xFromSkew, 2) + Math.pow(yFromSkew, 2));

            var deltaY =  Math.sin((td.ySkew/CANVAS_HEIGHT) * Math.PI/2) * 20;
            var deltaX =  Math.sin((td.xSkew/CANVAS_WIDTH) * Math.PI/2) * 20;
            y += deltaY + distanceToSkewPoint/td.height*deltaY*5 - td.ySkew * td.height/500;
            x += deltaX + distanceToSkewPoint/td.width*deltaX*5 - td.xSkew * td.width/500;


            // apply the rotation
            var rotationInRadians = td.rotation * (Math.PI/180);
            var xFromPivot = x - ppx;
            var yFromPivot = y - ppy;
            var startingAngle = Math.PI /2 - Math.atan2(yFromPivot, xFromPivot);
            var radius = Math.sqrt(Math.pow(xFromPivot, 2) + Math.pow(yFromPivot, 2));
            x = ppx + Math.sin(startingAngle + rotationInRadians) * radius;
            y = ppy + Math.cos(startingAngle + rotationInRadians) * radius;

            return [x, y];
        };

        return {
            Init: function(canvasElement) {
                return new Renderer(canvasElement);
            }
        };
    });
