/**
 * Created by Michael on 10/03/14.
 */

angular.module('drawACat.cat.directives')

    .directive('dacStage', function($window, $timeout, CONFIG, userOptions, catSimplifier, renderer, transformer, actuator) {
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
                renderer.setCanvas(canvas);
                renderer.strokeStyle(CONFIG.STROKE_COLOUR);
                renderer.fillStyle(CONFIG.FILL_COLOUR);
                renderer.lineWidth(2);
                var originalCat = scope.cat;
                scope.cat = catSimplifier.simplifyCat(originalCat, userOptions.getRenderQuality());
                scope.cat.emotion = originalCat.emotion;
                var balls = scope.ball;
                var respondTo = 'ball';
                var BALL_ATTENTION_SPAN = 10; // how many frames for cat stay fixated on one ball for?
                var ballOfInterest = {
                    ballIndex: 0,
                    timeFixated: 0
                };

                actuator.init(scope.cat);
                scope.pointerX = 0; // mouse pointer location
                scope.pointerY = 0;

                function resizeCanvas() {
                    var windowWidth = $window.innerWidth;
                    var windowHeight = $window.innerHeight;
                    canvas.width = windowWidth;
                    canvas.height = windowHeight;

                    angular.forEach(balls, function(ball) {
                        ball.windowResized();
                    });

                    // move the cat to be in the centre and at the bottom of the canvas
                    scope.cat.resizeToWindow(canvas.width, canvas.height);
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

                    angular.forEach(balls, function(ball) {
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
                    });
                };

                scope.mouseDownHandler = function(e) {
                    var stageRect = canvas.getBoundingClientRect();
                    scope.pointerX = e.clientX - stageRect.left;
                    scope.pointerY = e.clientY - stageRect.top;

                    angular.forEach(balls, function(ball) {
                        if (ball.pointerIsOver(scope.pointerX, scope.pointerY)) {
                            ball.startDrag();
                        }
                    });

                    // touching cat's head?
                    if (scope.cat.bodyParts.head.part.pointerIsOver(scope.pointerX, scope.pointerY)) {
                        scope.cat.emotion.startStroking();
                        scope.cat.bodyParts.head.behaviour.sensitivity.rotation *= -1;
                        scope.cat.bodyParts.head.behaviour.sensitivity.xSkew *= -1;
                        respondTo = 'pointer';
                    }
                };

                scope.mouseUpHandler = function() {
                    angular.forEach(balls, function(ball) {
                        ball.endDrag();
                    });
                    scope.cat.emotion.stopStroking();
                    if (respondTo === 'pointer') {
                        scope.cat.bodyParts.head.behaviour.sensitivity.rotation *= -1;
                        scope.cat.bodyParts.head.behaviour.sensitivity.xSkew *= -1;
                        respondTo = 'ball';
                    }
                };

                scope.$watch(function() {
                    return userOptions.getRenderQuality();
                }, function(newVal) {
                    scope.cat.emotion.stop();
                    scope.cat = catSimplifier.simplifyCat(originalCat, newVal / 10);
                    scope.cat.emotion = originalCat.emotion;
                    scope.cat.emotion.start();
                    resizeCanvas();
                });

                scope.$on("$destroy", function() {
                    //$window.cancelAnimationFrame(rafId);
                    $window.cancelAnimationFrame(renderLoopId);
                    $timeout.cancel(logicLoopId);
                    actuator.destroy();
                });

                /**
                 * The main animation loop
                 */
                var renderLoopId;
                var renderLoop = function() {
                    renderLoopId = $window.requestAnimationFrame(renderLoop);

                    renderer.clearCanvas();
                    renderer.renderCat(scope.cat);
                    angular.forEach(balls, function(ball) {
                        renderer.renderBall(ball);
                    });
                    // display fps
                    renderer.displayFps();
                };
                renderLoop();

                var logicLoopId;
                var logicLoop = function() {
                    logicLoopId = $timeout(logicLoop, 1000 / 60, false);

                    var input = getInputCoordinates();
                    transformer.transform(scope.cat, input.x, input.y);
                    // ball logic
                    angular.forEach(balls, function(ball) {
                        ball.checkOtherBallCollision(balls);
                        ball.updatePosition();
                        var touchedBallLeft = ball.checkPartCollision(scope.cat.bodyParts.leftLeg.part);
                        var touchedBallRight = ball.checkPartCollision(scope.cat.bodyParts.rightLeg.part);
                        if (touchedBallLeft || touchedBallRight) {
                            scope.cat.emotion.getExcited();
                        }
                    });
                    // debug
                    scope.moodValue = scope.cat.emotion.getMoodValue();
                };
                logicLoop();

                function getInputCoordinates() {
                    var inputX, inputY;

                    if (respondTo === 'ball') {
                        var interestingBall = getMostInterestingBall();
                        inputX = interestingBall.getX();
                        inputY = interestingBall.getY();
                    } else {
                        inputX = scope.pointerX;
                        inputY = scope.pointerY;
                    }

                    inputX = isNaN(inputX) ? 0 : inputX;
                    inputY = isNaN(inputY) ? 0 : inputY;

                    return {
                        x: inputX,
                        y: inputY
                    };
                }

                function getMostInterestingBall() {
                    // the "most interesting" ball is the one the cat will follow. "Most interesting" is defined by a combination of
                    // the factors: overall velocity and proximity to cat.
                    if (BALL_ATTENTION_SPAN < ballOfInterest.timeFixated) {
                        var catBody = scope.cat.bodyParts['body'].part.getTransformationData();
                        var catPosition = [catBody.centreX, catBody.centreY];
                        var maxInterestVal = 0;
                        angular.forEach(balls, function(ball, index) {
                            var velocityVal = Math.abs(ball.getVx() * ball.getVy());
                            var xProximity = Math.abs(ball.getX() - catPosition[0]);
                            var yProximity = Math.abs(ball.getY() - catPosition[1]);
                            var proximityVal = xProximity + yProximity;
                            var interestValue = velocityVal * 100/proximityVal;

                            if (maxInterestVal < interestValue) {
                                ballOfInterest.ballIndex = index;
                                maxInterestVal = interestValue;
                            }
                        });
                        ballOfInterest.timeFixated = 0;
                    } else {
                        ballOfInterest.timeFixated ++;
                    }
                    return balls[ballOfInterest.ballIndex];
                }
            }
        };
    }
);