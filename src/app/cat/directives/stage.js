/**
 * Created by Michael on 10/03/14.
 */

angular.module('drawACat.cat.directives')

    .directive('dacStage', function($window, CONFIG,  renderer, transformer, actuator) {
        return {
            restrict: 'E',
            templateUrl: 'cat/directives/stage.tpl.html',
            replace: true,
            scope: {
                cat: '=',
                ball: '='
            },
            link: function(scope) {
                /**
                 * Initializations
                 */
                scope.debugMode = false;

                var canvas = document.getElementById('stage');
                var _renderer = renderer.Init(canvas);
                _renderer.strokeStyle(CONFIG.STROKE_COLOUR);
                _renderer.fillStyle(CONFIG.FILL_COLOUR);
                _renderer.lineWidth(2);
                var ball = scope.ball;
                var respondTo = 'ball';

                actuator.init(scope.cat);
                scope.pointerX = 0; // mouse pointer location
                scope.pointerY = 0;

                function resizeCanvas() {
                    var windowWidth = $window.innerWidth;
                    var windowHeight = $window.innerHeight;
                    canvas.width = windowWidth;
                    canvas.height = windowHeight;

                    ball.windowResized();

                    // move the cat to be in the centre and at the bottom of the canvas
                    var catWidth = scope.cat.getWidth();
                    var catHeight = scope.cat.getHeight();
                    var xAdjustment = (windowWidth / 2) - (catWidth / 2);
                    var yAdjustment = windowHeight - (catHeight);
                    scope.cat.adjustPosition(xAdjustment, yAdjustment);
                }
                resizeCanvas();

                /**
                 * Event handlers
                 */
                angular.element($window).bind('resize', function() {
                    resizeCanvas();
                });

                scope.mouseMoveHandler = function(e) {
                    var stageRect = canvas.getBoundingClientRect();
                    scope.pointerX = e.clientX - stageRect.left;
                    scope.pointerY = e.clientY - stageRect.top;
                    if(ball.isInDragMode()) {
                        var lastX = ball.getX();
                        var lastY = ball.getY();
                        ball.setVx(scope.pointerX - lastX);
                        ball.setVy(scope.pointerY - lastY);
                        ball.setX(scope.pointerX);
                        ball.setY(scope.pointerY);

                        // if the pointer goes off the canvas, drop the ball
                        var pad = 10;
                        if (scope.pointerX <= pad ||
                            scope.pointerX >= canvas.width - pad ||
                            scope.pointerY <= pad ||
                            scope.pointerY >= canvas.height - pad) {
                            ball.endDrag();
                        }
                    }
                };

                scope.mouseDownHandler = function(e) {
                    var stageRect = canvas.getBoundingClientRect();
                    scope.pointerX = e.clientX - stageRect.left;
                    scope.pointerY = e.clientY - stageRect.top;
                    if (ball.pointerIsOver(scope.pointerX, scope.pointerY)) {
                        ball.startDrag();
                    }

                    // touching cat's head?
                    if (scope.cat.bodyParts.head.part.pointerIsOver(scope.pointerX, scope.pointerY)) {
                        scope.cat.emotion.startStroking();
                        scope.cat.bodyParts.head.behaviour.sensitivity.rotation *= -1;
                        scope.cat.bodyParts.head.behaviour.sensitivity.xSkew *= -1;
                        respondTo = 'pointer';
                    }
                };

                scope.mouseUpHandler = function() {
                    ball.endDrag();
                    scope.cat.emotion.stopStroking();
                    if (respondTo === 'pointer') {
                        scope.cat.bodyParts.head.behaviour.sensitivity.rotation *= -1;
                        scope.cat.bodyParts.head.behaviour.sensitivity.xSkew *= -1;
                        respondTo = 'ball';
                    }
                };

                scope.$on("$destroy", function() {
                    if (rafId) {
                        $window.cancelAnimationFrame(rafId);
                        actuator.destroy();
                    }
                });

                /**
                 * The main animation loop
                 */
                var rafId;
                var renderFrame = function() {
                    _renderer.clearCanvas();
                    var input = getInputCoordinates();
                    transformer.transform(scope.cat, input.x, input.y);
                    _renderer.renderCat(scope.cat);

                    // ball logic
                    ball.updatePosition();
                    var touchedBallLeft = ball.checkPartCollision(scope.cat.bodyParts.leftLeg.part);
                    var touchedBallRight = ball.checkPartCollision(scope.cat.bodyParts.rightLeg.part);
                    if (touchedBallLeft || touchedBallRight) {
                        scope.cat.emotion.getExcited();
                    }

                    _renderer.renderBall(ball);
                    // debug
                    scope.moodValue = scope.cat.emotion.getMoodValue();

                    rafId = $window.requestAnimationFrame(renderFrame);
                };
                function getInputCoordinates() {
                    var inputX = respondTo === 'ball' ? ball.getX() : scope.pointerX;
                    var inputY = respondTo === 'ball' ? ball.getY() : scope.pointerY;

                    inputX = isNaN(inputX) ? 0 : inputX;
                    inputY = isNaN(inputY) ? 0 : inputY;

                    return {
                        x: inputX,
                        y: inputY
                    };
                }
                renderFrame();
            }
        };
    }
);