/**
 * Created by Michael on 07/03/14.
 */

angular.module('drawACat.common.services')
/**
 * The renderer service is responsible for all drawing to the canvas element.
 */
    .factory('renderer', function() {

        var context;
        var strokeStyle = '#333333';
        var fillStyle = '#efefef';
        var lineWidth = 2;
        var debugMode = false;
        var MAX_RENDER_QUALITY = 10;
        var renderQuality = 10;

        var Renderer = function(canvasElement) {
            context = canvasElement.getContext('2d');
            context.lineWidth = lineWidth;
        };

        Renderer.prototype.strokeStyle = function(value) {
            strokeStyle = value;
        };

        Renderer.prototype.fillStyle = function(value) {
            fillStyle = value;
        };
        Renderer.prototype.lineWidth = function(value) {
            lineWidth = value;
        };

        Renderer.prototype.drawStart = function(x, y) {
            context.beginPath();
            context.moveTo(x, y);
        };

        Renderer.prototype.drawMove = function(x, y) {
            context.lineTo(x, y);
            context.strokeStyle = strokeStyle;
            context.stroke();
        };

        Renderer.prototype.clearCanvas = function() {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        };

        Renderer.prototype.renderPath = function(path) {
            for (var line = 0; line < path.length; line ++) {
                if (0 < path[line].length) {
                    renderLine(path[line]);
                }
            }
        };

        Renderer.prototype.renderCat = function(cat) {

            // cause the parts to be rendered in a specific sequence, so that
            // the body is at the back, the head is on top of the body etc.
            var sequence = [
                'body',
                'head',
                'eyesOpen',
                'eyesClosed',
                'mouthOpen',
                'mouthClosed',
                'leftLeg',
                'rightLeg'
            ];

            angular.forEach(sequence, function(bodyPartName) {
                var bodyPart = cat.bodyParts[bodyPartName];
                if (bodyPart.part) {
                    if (!bodyPart.behaviour || bodyPart.behaviour.visible !== false) {
                        renderPartWithTransformations(bodyPart.part);
                    }
                }
            });
        };

        var renderPartWithTransformations = function(part) {
            var path = part.getPath();
            var transformationData = part.getTransformationData();
            var coords;
            var nextCoords;

            context.strokeStyle = strokeStyle;
            context.lineWidth = lineWidth;
            for (var line = 0; line < path.length; line ++) {
                if (0 < path[line].length) {
                    //context.beginPath();
                    //coords = applyTransformations(path[line][0], transformationData);
                    //context.moveTo(coords[0], coords[1]);
                    /*jshint loopfunc: true*/
                    var transformedLine = path[line].map(function(point) {
                        return applyTransformations(point, transformationData);
                    });
                    renderLine(transformedLine);

                    /*if (2 < path[line].length) {
                     for(var point = 1; point < path[line].length - 2; point ++) {
                     var renderEvery = MAX_RENDER_QUALITY + 1 - renderQuality;
                     if (point % renderEvery === 0) {
                     coords = applyTransformations(path[line][point], transformationData);
                     nextCoords = applyTransformations(path[line][point + 1], transformationData);

                     var c = (coords[0] + nextCoords[0]) / 2,
                     d = (coords[1] + nextCoords[1]) / 2;
                     context.quadraticCurveTo(coords[0], coords[1], c, d);
                     }
                     }
                     //context.quadraticCurveTo(coords[0], coords[1], nextCoords[0], nextCoords[1]);
                     } else {
                     context.lineTo(coords[0], coords[1]);
                     }*/

                    /*for(var point = 1; point < path[line].length; point ++) {

                     // adjust the number of points we draw, depending on the renderQuality setting
                     var renderEvery = MAX_RENDER_QUALITY + 1 - renderQuality;
                     if (point % renderEvery === 0) {
                     coords = applyTransformations(path[line][point], transformationData);
                     context.lineTo(coords[0], coords[1]);
                     }
                     }*/

                    if (lineIsABoundary(path[line])) {
                        context.fillStyle = fillStyle;
                        context.fill();
                    }
                    context.stroke();
                }
            }

            if (debugMode) {
                // debug - draw bounding box
                var bb = part.getBoundingBox();
                context.fillStyle = 'rgba(250,200,200,0.3)';
                context.fillRect(bb.x, bb.y, bb.width, bb.height);

                // draw acceleration vector
                if (part.vx) {
                    context.strokeStyle = 'rgba(150, 240, 150, 1)';
                    context.beginPath();
                    context.moveTo(transformationData.centreX, transformationData.centreY);
                    context.lineTo(transformationData.centreX + part.vx, transformationData.centreY + part.vy);
                    context.stroke();
                }
            }
        };

        function renderLine(line) {
            if (line.length < 2) {
                return;
            }
            context.strokeStyle = strokeStyle;
            context.lineWidth = lineWidth;
            context.beginPath();

            context.moveTo(line[0][0], line[0][1]);

            //lineLoopQuadratic(line);
            //lineLoopSimple(line);
            lineLoopHybrid(line);

            if (lineIsABoundary(line)) {
                context.fillStyle = fillStyle;
            } else {
                context.fillStyle = 'rgba(0,0,0,0)';
            }

            context.fill();
            context.stroke();
        }

        function lineLoopSimple(line) {
            for (var i = 1; i < line.length; i++) {
                context.lineTo(line[i][0], line[i][1]);
            }
        }

        function lineLoopQuadratic(line) {
            if (2 < line.length) {
                for (var i = 1; i < line.length - 2; i++) {
                    var c = (line[i][0] + line[i + 1][0]) / 2,
                        d = (line[i][1] + line[i + 1][1]) / 2;
                    context.quadraticCurveTo(line[i][0], line[i][1], c, d);
                }
                context.quadraticCurveTo(line[i][0], line[i][1], line[i + 1][0], line[i + 1][1]);
            } else {
                context.lineTo(line[1][0], line[1][1]);
            }
        }

        function lineLoopHybrid(line) {
            if (2 < line.length) {
                for (var i = 1; i < line.length - 2; i++) {

                    // find the angle between this point and the one after next, with the next point as a vertex
                    var ANGLE_THRESHHOLD = 0.2;
                    var startPoint = line[i];
                    var vertexPoint = line[i+1];
                    var endPoint = line[i+2];

                    var angle1 = Math.atan2(vertexPoint[1] - startPoint[1], vertexPoint[0] - startPoint[0]);
                    var angle2 = Math.atan2(endPoint[1] - vertexPoint[1], endPoint[0] - vertexPoint[0]);
                    var c = (line[i][0] + line[i + 1][0]) / 2,
                        d = (line[i][1] + line[i + 1][1]) / 2;
                    if (ANGLE_THRESHHOLD < Math.abs(angle1 - angle2)) {
                        context.quadraticCurveTo(line[i][0], line[i][1], c, d);
                    } else {
                        context.lineTo(c, d);
                    }
                }
                context.lineTo(line[i][0], line[i][1]);
            } else {
                context.lineTo(line[1][0], line[1][1]);
            }
        }

        /**
         * Determine whether this line encloses an area and therefore should be filled in. A line is
         * considered a boundary if the width or height of the shape it creates is greater than the
         * distance between the start and end points.
         * @param line
         * @returns {boolean}
         */
        var lineIsABoundary = function(line) {
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
        var getLineLimits = function(line) {
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
            var canvasWidth = context.canvas.width;
            var canvasHeight = context.canvas.height;
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

        Renderer.prototype.renderBall = function(ball) {
            context.save();
            context.translate(ball.getX(), ball.getY());
            context.rotate(ball.getAngle());
            context.drawImage(ball.getImage(), -ball.getRadius(), -ball.getRadius());
            context.restore();
        };

        return {
            Init: function(canvasElement) {
                return new Renderer(canvasElement);
            },
            setRenderQuality: function(quality) {
                if (0 < quality && quality <= 10) {
                    renderQuality = parseInt(quality, 10);
                }
            },
            getRenderQuality: function() {
                return renderQuality;
            }
        };
    });
