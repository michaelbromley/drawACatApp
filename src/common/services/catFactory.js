/**
 * Created by Michael on 08/03/14.
 */
angular.module('drawACat.common.services')

/**
 * This is the service that creates Cat objects. A Cat is a collections of specific Parts, such as head, body, rightLeg, leftLeg etc. Each part has an
 * associated behaviour object that defines how that part responds to events such as user interaction.
 */
    .factory('catFactory', function() {
        var Cat = function() {
            var bodyParts = {};
            bodyParts.head = {};
            bodyParts.eyesOpen = {};
            bodyParts.eyesClosed = {};
            bodyParts.mouthOpen = {};
            bodyParts.mouthClosed = {};
            bodyParts.body = {};
            bodyParts.leftLeg = {};
            bodyParts.rightLeg = {};
            this.bodyParts = bodyParts;
        };

        /**
         * Get a path array for the whole cat, which concatenates each bodyPart path into one big array.
         * Omits the closedEyes and the openMouth parts from the path.
         * @returns {Array}
         */
        Cat.prototype.getPath = function() {
            var path = [];
            angular.forEach(this.bodyParts, function(bodyPart, partName) {
                if (partName !== 'eyesClosed' &&
                    partName !== 'mouthOpen' &&
                    bodyPart.part) {
                    var partPath = bodyPart.part.getPath();
                    path = path.concat(partPath);
                }
            });
            return path;
        };

        Cat.prototype.adjustPosition = function(x, y) {
            angular.forEach(this.bodyParts, function(bodyPart) {
                if (bodyPart.part) {
                    bodyPart.part.setGlobalOffset(x, y);
                }
            });
        };

        Cat.prototype.getHeight = function() {
            var heightBoundaries = this.getBoundaries('y');
            return heightBoundaries.max - heightBoundaries.min;
        };

        Cat.prototype.getWidth = function() {
            var widthBoundaries = this.getBoundaries('x');
            return widthBoundaries.max - widthBoundaries.min;
        };

        /**
         * Calculate the dimension (x or y - width or height) of the entire cat.
         * @param dimension
         * @returns {number}
         */
        Cat.prototype.getBoundaries = function(dimension) {
            var xOrY = dimension === 'x' ? 0 : 1;
            var path = this.getPath();

            var maxCandidates = [];
            var minCandidates = [];

            angular.forEach(path, function(partPath) {
                // get the maximum value for each part
                var maxCandidate = partPath.reduce(function(max, arr) {
                    return Math.max(max, arr[xOrY]);
                }, -Infinity);
                maxCandidates.push(maxCandidate);

                // get minimum values for each part
                var minCandidate = partPath.reduce(function(min, arr) {
                    return Math.min(min, arr[xOrY]);
                }, Infinity);
                minCandidates.push(minCandidate);
            });

            var max = Math.max.apply(null, maxCandidates);
            var min = Math.min.apply(null, minCandidates);

            return {
                max: max,
                min: min
            };
        };


        return {
            newCat: function() {
                return new Cat();
            }
        };
    }
);