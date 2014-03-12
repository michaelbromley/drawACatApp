/**
 * Created by Michael on 07/03/14.
 */

angular.module('drawACat.common.services')


    .factory('primitives', function() {

        /**
         * A Part is a discrete object that has been drawn and is considered one entity, although
         * it may be composed of many Lines.
         * @constructor
         */
        var Part = function() {
            var name;
            var x; // x coordinate of top left corner of part
            var y; // y coordinate of top left corner of part
            var xOffset = 0; // used to move the part around the canvas
            var yOffset = 0;
            var rotation = 0;
            var xSkew = 0;
            var ySkew = 0;
            var pivotPointX; // used as the point around which the part may rotate and skew
            var pivotPointY;
            var width;
            var height;

            var maskWidth; // the mask is used to clear the area when the part was when doing a render
            var maskHeight;
            var maskX;
            var maskY;

            var centrePoint;
            var path;
            var parentPart;


            /**
             * Create a new part from a given path array of points.
             * @param newName
             * @param newPath
             */
            this.createFromPath = function(newName, newPath) {
                name = newName;
                path = newPath;
                var minX = 1000000, minY = 1000000, maxX = 0, maxY = 0; // for calculating the centre point and bounding box

                // loop through the lines and points of the path to calculate the dimensions of the part, which is used to figure out
                // width, height, centre point, pivot point.
                for (var line = 0; line < path.length; line ++) {
                    for(var point = 0; point < path[line].length; point ++) {
                        minX = path[line][point][0] < minX ? path[line][point][0] : minX;
                        minY = path[line][point][1] < minY ? path[line][point][1] : minY;
                        maxX = path[line][point][0] > maxX ? path[line][point][0] : maxX;
                        maxY = path[line][point][1] > maxY ? path[line][point][1] : maxY;
                    }
                }

                x = minX;
                y = minY;
                width = maxX - minX;
                height = maxY - minY;
                centrePoint = [x + width / 2, y + height / 2];
                pivotPointX = centrePoint[0]; // set the pivotPoint to the centre by default
                pivotPointY = centrePoint[1];
            };

            /**
             * Get the name of this part
             * @returns {*}
             */
            this.getName = function() {
                return name;
            };

            /**
             * Set a reference to another Path that is the parent of this part.
             * A part that has a parent will defer its transformation data to its parent.
             * This is used, for example with eyes. The 'head' part is the parent of the 'eyes' part.
             * This ensures that the parent and all its children are transformed uniformly and appear as one object on the stage.
             * @param part
             */
            this.setParent = function(part) {
                parentPart = part;
            };

            this.getParent = function() {
                return parentPart ? parentPart : null;
            };

            this.setXOffset = function(newXOffset) {
                xOffset = parseInt(newXOffset, 10);
            };
            this.setYOffset = function(newYOffset) {
                yOffset = parseInt(newYOffset, 10);
            };
            this.setRotation = function(newRotation) {
                rotation = parseInt(newRotation, 10);
            };
            this.setXSkew = function(newXSkew) {
                xSkew = parseInt(newXSkew, 10);
            };
            this.setYSkew = function(newYSkew) {
                ySkew = parseInt(newYSkew, 10);
            };



            this.getTransformationData = function() {
                if (parentPart) {
                    return parentPart.getTransformationData();
                } else {
                    return {
                        xOffset: xOffset,
                        yOffset: yOffset,
                        pivotPointX: pivotPointX,
                        pivotPointY: pivotPointY,
                        rotation: rotation,
                        xSkew: xSkew,
                        ySkew: ySkew,
                        width: width,
                        height: height,
                        centreX: centrePoint[0],
                        centreY: centrePoint[1]
                    };
                }
            };

            this.getPath = function() {
                return path;
            };

            /**
             * Set the location and dimensions of the mask (the bounding rectangle of the part).
             * @param x
             * @param y
             * @param width
             * @param height
             */
            this.setMask = function(x, y, width, height) {
                maskX = x;
                maskY = y;
                maskWidth = width;
                maskHeight = height;
            };
        };

        /**
         * A Line is an object representing one continuous stroke of the brush, ie starting with a
         * mousedown/touch start, proceeding through all mouse movements until mouseup/touch end.
         * @constructor
         */
        var Line = function() {
            var points = [];
            var currentPoint = 0;

            /**
             *  Add a point to the array of points (coordinates) making up the line
             */
            this.addPoint = function(x, y) {
                points.push([x, y]);
                currentPoint += 1;
            };

            this.endDraw = function() {

            };
            this.getPath = function() {
                return points;
            };
        };

        /**
         * A LineCollection is simply a group of lines that can be used as a temporary store of individual
         * line objects, and should enable undo/redo functionality. A LineCollection should also be able to
         * be converted into a Part.
         */
        var LineCollection = function() {
            var lines = [];

            this.addLine = function(line) {
                lines.push(line);
            };

            this.removeLine = function() {
                lines.pop();
            };

            /**
             * Add all the lines to a single path array and return that.
             * @returns {Array}
             */
            this.getPath = function() {
                var path = [];
                for (var i = 0; i < lines.length; i++) {
                    var linePath = lines[i].getPath();
                    path.push(linePath);
                }
                return path;
            };

            this.count = function() {
                return lines.length;
            };
        };


        return {
            Line: function() {
                return new Line();
            },
            LineCollection: function() {
                return new LineCollection();
            },
            Part: function() {
                return new Part();
            }
        };
    });