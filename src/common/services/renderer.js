/**
 * Created by Michael on 07/03/14.
 */

angular.module('drawACat.common.services')
/**
 * The renderer service is responsible for all drawing to the canvas element.
 */
    .service('renderer', function(renderHelper) {

        var context;
        var strokeStyle = '#333333';
        var fillStyle = '#efefef';
        var lineWidth = 2;
        var debugMode = false;

        this.setCanvas = function(canvasElement) {
            context = canvasElement.getContext('2d');
            context.lineWidth = lineWidth;
            context.lineCap = 'round';
            context.lineJoin = 'round';
            return this;
        };

        this.strokeStyle = function(value) {
            strokeStyle = value;
        };

        this.fillStyle = function(value) {
            fillStyle = value;
        };
        this.lineWidth = function(value) {
            lineWidth = value;
        };

        this.clearCanvas = function() {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            context.beginPath();
        };

        this.renderPath = function(path) {
            for (var line = 0; line < path.length; line ++) {
                if (0 < path[line].length) {
                    renderLineAndFill(path[line]);
                }
            }
        };

        this.renderSingleLine = function(line) {
            if (1 < line.length) {
                this.renderPath([line]);
            }
        };

        this.renderCat = function(cat) {
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
            var canvasWidth = context.canvas.width;
            var canvasHeight = context.canvas.height;
            context.strokeStyle = strokeStyle;
            context.lineWidth = lineWidth;

            for (var line = 0; line < path.length; line ++) {
                if (0 < path[line].length) {
                    var transformedLine = renderHelper.applyTransformationsToLine(path[line], transformationData, canvasWidth, canvasHeight);
                    renderLineAndFill(transformedLine);
                    //context.stroke();
                }
            }

            if (debugMode) {
                renderBoundingBox(part);
            }
        };

        function renderLineAndFill(line) {
            if (line.length < 2) {
                return;
            }
            context.strokeStyle = strokeStyle;
            context.lineWidth = lineWidth;
            context.beginPath();
            context.moveTo(line[0][0], line[0][1]);
            renderLine(line);

            if (renderHelper.lineIsABoundary(line)) {
                context.fillStyle = fillStyle;
            } else {
                context.fillStyle = 'rgba(0,0,0,0)';
            }
            context.fill();
            context.stroke();
        }

        function renderLine(line) {
            if (2 < line.length) {
                for (var i = 1; i < line.length - 2; i++) {
                    var c = (line[i][0] + line[i + 1][0]) / 2,
                        d = (line[i][1] + line[i + 1][1]) / 2;
                    var sketchiness = Math.random() / 1.5;
                    //context.lineTo(c + sketchiness, d + sketchiness);
                    context.quadraticCurveTo(line[i][0], line[i][1], c + sketchiness, d + sketchiness);
                    pointsDrawn ++; // for debug
                }
                context.lineTo(line[i][0], line[i][1]);
            } else {
                context.lineTo(line[1][0], line[1][1]);
            }
        }

        this.renderBall = function(ball) {
            context.save();
            context.translate(ball.getX(), ball.getY());
            context.rotate(ball.getAngle());
            context.drawImage(ball.getImage(), -ball.getRadius(), -ball.getRadius());
            context.restore();
        };

        function renderBoundingBox(part) {
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

        var frame = 0;
        var lastTimeMeasure = 0;
        var fps;
        var pointsDrawn;
        this.displayFps = function() {
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
    });