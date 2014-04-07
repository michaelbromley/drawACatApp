/**
 * Created by Michael on 19/03/14.
 */

angular.module('drawACat.draw.services')

    .factory('thumbnailGenerator', function(CONFIG, renderer) {

        var DIMENSION = 500; // thumbnail dimensions in pixels
        var canvas = angular.element('<canvas></canvas>')[0];
        canvas.width = DIMENSION;
        canvas.height = DIMENSION;

        function fillBackground() {
            var context = canvas.getContext('2d');
            context.fillStyle = CONFIG.FILL_COLOUR;
            context.fillRect(0, 0, DIMENSION, DIMENSION);
        }

        function getScaledCatPath(cat) {
            var path = cat.getPath();
            var width = cat.getWidth();
            var height = cat.getHeight();
            var scaleFactor = DIMENSION / Math.max(width, height);
            var scaledPath;
            scaledPath = path.map(function (line) {
                    return line.map(function (point) {
                        return [point[0] * scaleFactor, point[1] * scaleFactor];
                    });
                }
            );
            return scaledPath;
        }


        var generateThumbnailFromCat = function(cat) {
            renderer.setCanvas(canvas);
            renderer.fillStyle(CONFIG.FILL_COLOUR);
            renderer.strokeStyle(CONFIG.STROKE_COLOUR);
            renderer.lineWidth(3);

            fillBackground();

            var path = getScaledCatPath(cat);
            renderer.renderPath(path);

            return  canvas.toDataURL();
        };


        return {
            getDataUri: generateThumbnailFromCat
        };
    });