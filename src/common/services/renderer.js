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
        var lineNoiseGenerator;
        var lineNoiseCounter;
        var lineNoiseIncrementer = 0;

        var Renderer = function(canvasElement) {
            context = canvasElement.getContext('2d');
            context.lineWidth = lineWidth;
            context.lineCap = 'round';
            context.lineJoin = 'round';
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
            pointsDrawn = 0;

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

            context.strokeStyle = strokeStyle;
            context.lineWidth = lineWidth;

            for (var line = 0; line < path.length; line ++) {
                if (0 < path[line].length) {
                    var transformedLine = applyTransformationsToLine(path[line], transformationData);
                    var optimisedLine = optimiseLine(transformedLine);
                    renderLine(optimisedLine);

                    if (lineIsABoundary(optimisedLine)) {
                        context.fillStyle = fillStyle;
                        context.fill();
                    }
                    context.stroke();
                }
            }
            function optimiseLine(line) {
                var lineSize = line.length - 1;
                var lastPoint = [0, 0];

                return line.filter(function(point, i, line) {
                    var delta = 2;
                    if (0 < i && i !== lineSize) {
                        if (Math.abs(lastPoint[0] - point[0]) > delta ||
                            Math.abs(lastPoint[1] - point[1]) > delta ) {
                            lastPoint = point;
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return true;
                    }
                });
            }
            function applyTransformationsToLine(line, transformationData) {
                return line.map(function(point) {
                    return applyTransformations(point, transformationData);
                });
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

            // TODO: pick or write an efficient line rendering algorithm
            //lineLoopQuadratic(line);
            //lineLoopSimple(line);
            lineLoopHybrid(line);

            if (lineIsABoundary(line)) {
                context.fillStyle = fillStyle;
            } else {
                context.fillStyle = 'rgba(0,0,0,0)';
            }

            context.fill();
            //context.stroke(); // experiment to move stroke to end of whole cat - framerate from ~20 - ~30
        }

        function lineLoopSimple(line) {
            var lastPoint = [0, 0];
            for (var i = 1; i < line.length; i++) {
                var renderEvery = MAX_RENDER_QUALITY + 1 - renderQuality;
                if (i % renderEvery === 0) {
                    //var sketchiness = lineNoiseGenerator.getVal(lineNoiseCounter + lineNoiseIncrementer);
                    //sketchiness = 0;
                    sketchiness = Math.random();
                    context.lineTo(line[i][0] + sketchiness, line[i][1] + sketchiness);
                    lastPoint = line[i];
                    pointsDrawn ++; // for debug
                }
            }
        }

        function lineLoopQuadratic(line) {
            if (2 < line.length) {
                for (var i = 1; i < line.length - 2; i++) {
                    var renderEvery = MAX_RENDER_QUALITY + 1 - renderQuality;
                    if (i % renderEvery === 0) {
                        var sketchiness = Math.random();
                        lineNoiseCounter ++;
                        var c = (line[i][0] + line[i + 1][0]) / 2,
                            d = (line[i][1] + line[i + 1][1]) / 2;
                        context.quadraticCurveTo(line[i][0] + sketchiness, line[i][1] + sketchiness, c + sketchiness, d + sketchiness);
                        pointsDrawn ++; // for debug
                    }
                }
                context.quadraticCurveTo(line[i][0], line[i][1], line[i + 1][0], line[i + 1][1]);
            } else {
                context.lineTo(line[1][0], line[1][1]);
            }
        }

        function lineLoopHybrid(line) {
            if (2 < line.length) {
                for (var i = 1; i < line.length - 2; i++) {
                    var renderEvery = MAX_RENDER_QUALITY + 1 - renderQuality;
                    if (i % renderEvery === 0) {
                        var c = (line[i][0] + line[i + 1][0]) / 2,
                            d = (line[i][1] + line[i + 1][1]) / 2;
                        var sketchiness = Math.random();
                        context.lineTo(c + sketchiness, d + sketchiness);
                        pointsDrawn ++; // for debug
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

        var frame = 0;
        var lastTimeMeasure = 0;
        var fps;
        var pointsDrawn;
        Renderer.prototype.displayFps = function() {
            if (lastTimeMeasure === 0) {
                lastTimeMeasure = new Date().getTime();
            }

            if (frame % 10 === 0) {
                var timeNow = new Date().getTime();
                var secondsElapsed = (timeNow - lastTimeMeasure) / 1000;
                fps = 10/secondsElapsed;
                lastTimeMeasure = timeNow;
            }
            frame ++;


            // render it
            var oldFillStyle = context.fillStyle;
            context.fillStyle = "blue";
            context.font = "12px Arial";
            context.fillText("Points drawn: " + pointsDrawn + ", fps: " + fps.toFixed(2).toString(), 10, 500);
            context.fillStyle = oldFillStyle;

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
