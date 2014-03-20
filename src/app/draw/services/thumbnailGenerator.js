/**
 * Created by Michael on 19/03/14.
 */

angular.module('drawACat.draw.services')

.factory('thumbnailGenerator', function(renderer) {

        var generateThumbnailFromCat = function(cat) {

            var DIMENSION = 100; // thumbnail dimensions in pixels

            var canvas = angular.element('<canvas></canvas>')[0];
            var path = cat.getPath();
            var width = cat.getWidth();
            var height = cat.getHeight();
            canvas.width = DIMENSION;
            canvas.height = DIMENSION;
            var scaleFactor = DIMENSION / Math.max(width, height);

            var _renderer = renderer.Init(canvas);
            _renderer.fillStyle('rgba(0, 0, 0, 0)');
            _renderer.strokeStyle('#333333');

            var scaledPath = path.map(function(line) {
                    return line.map(function(point) {
                        return [point[0] * scaleFactor, point[1] * scaleFactor];
                    });
                }
            );
            _renderer.renderPath(scaledPath);
            return  canvas.toDataURL();
        };


        return {
            getDataUri: generateThumbnailFromCat
        };
    });