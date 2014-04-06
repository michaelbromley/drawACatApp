/**
 * Created by Michael on 03/04/14.
 */

angular.module('drawACat.common.services')
/**
 * The renderer service is responsible for all drawing to the canvas element.
 */
    .service('renderHelper', function() {

        this.applyTransformationsToLine = function(line, transformationData, canvasWidth, canvasHeight) {
            return line.map(function(point) {
                return applyTransformations(point, transformationData, canvasWidth, canvasHeight);
            });
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
         * @param canvasWidth
         * @param canvasHeight
         */
        var applyTransformations = function(coords, transformationData, canvasWidth, canvasHeight) {
            var td;
            td = transformationData;
            var x = coords[0];
            var y = coords[1];

            // apply the offset
            x = x + td.xOffset;
            y = y + td.yOffset;
            var ppx = td.pivotPointX + td.xOffset;
            var ppy = td.pivotPointY + td.yOffset;

            // apply the skew
            var skewPointX = ppx + td.xSkew;
            var skewPointY = ppy + td.ySkew;
            var xFromSkew = x - skewPointX;
            var yFromSkew = y - skewPointY;
            var distanceToSkewPoint = Math.sqrt(Math.pow(xFromSkew, 2) + Math.pow(yFromSkew, 2));

            var deltaY =  Math.sin((td.ySkew/canvasHeight) * Math.PI/2) * 20;
            var deltaX =  Math.sin((td.xSkew/canvasWidth) * Math.PI/2) * 20;
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

        /**
         * Determine whether this line encloses an area and therefore should be filled in. A line is
         * considered a boundary if the width or height of the shape it creates is greater than the
         * distance between the start and end points.
         * @param line
         * @returns {boolean}
         */
        this.lineIsABoundary = function(line) {
            var startPoint = line[0];
            var endPoint = line[line.length - 1];
            var deltaX = Math.abs(startPoint[0] - endPoint[0]);
            var deltaY = Math.abs(startPoint[1] - endPoint[1]);
            var distanceBetweenEndPoints = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            var limits = getLineLimits(line);

            var width = limits.maxX - limits.minX;
            var height = limits.maxY - limits.minY;

            return (width > distanceBetweenEndPoints || height > distanceBetweenEndPoints);
        };

        /**
         * Find the maximum and minimum values of x and y for a given line.
         * @param line
         * @returns {{minX: number, maxX: number, minY: number, maxY: number}}
         */
        function getLineLimits(line) {
            var minX = 100000,
                maxX = 0,
                minY = 10000,
                maxY = 0;

            for(var point = 1; point < line.length; point ++) {
                minX = line[point][0] < minX ? line[point][0] : minX;
                minY = line[point][1] < minY ? line[point][1] : minY;
                maxX = line[point][0] > maxX ? line[point][0] : maxX;
                maxY = line[point][1] > maxY ? line[point][1] : maxY;
            }
            return {
                minX: minX,
                maxX: maxX,
                minY: minY,
                maxY: maxY
            };
        }

    })
;