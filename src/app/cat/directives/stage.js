/**
 * Created by Michael on 10/03/14.
 */

angular.module('drawACat.cat.directives')

    .directive('dacStage', function($window, $document, CONFIG, ballFactory, renderer, transformer, actuator, emotion) {



        return {
            restrict: 'E',
            templateUrl: 'cat/directives/stage.tpl.html',
            replace: true,
            scope: {
                cat: '='
            },
            link: function(scope, element) {
                var canvas = document.getElementById('stage');
                actuator.init(scope.cat);
                var _renderer = renderer.Init(canvas);
                scope.cat.emotion = emotion;

                scope.x = 0; // mouse pointer location
                scope.y = 0;

                var ball = ballFactory.newBall(25, CONFIG.BALL_IMAGE_SRC);

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
                angular.element($window).bind('resize', function() {
                    resizeCanvas();
                });

                var rafId;
                var renderFrame = function() {
                    _renderer.clearCanvas();
                    transformer.transform(scope.cat, ball.getX(), ball.getY());
                    _renderer.renderCat(scope.cat);

                    // ball logic
                    ball.updatePosition();
                    var touchedBallLeft = ball.checkPartCollision(scope.cat.bodyParts.leftLeg.part);
                    var touchedBallRight = ball.checkPartCollision(scope.cat.bodyParts.rightLeg.part);
                    if (touchedBallLeft || touchedBallRight) {
                        scope.cat.emotion.getExcited();
                    }
                    ball.pointerIsOver(scope.x, scope.y);
                    _renderer.renderBall(ball);
                    rafId = $window.requestAnimationFrame(renderFrame);

                    scope.cat.emotion.calmDown();
                    // debug
                    scope.moodValue = scope.cat.emotion.getMoodValue();
                };
                renderFrame();

                $document.on('mousemove', function(e) {
                    var stageRect = canvas.getBoundingClientRect();
                    scope.x = e.clientX - stageRect.left;
                    scope.y = e.clientY - stageRect.top;

                    if(ball.isInDragMode()) {
                        var lastX = ball.getX();
                        var lastY = ball.getY();
                        ball.setVx(scope.x - lastX);
                        ball.setVy(scope.y - lastY);
                        ball.setX(scope.x);
                        ball.setY(scope.y);
                    }
                });

                $document.on('mousedown', function(e) {
                    if (ball.pointerIsOver(scope.x, scope.y)) {
                        ball.startDrag();
                    }
                });

                $document.on('mouseup', function(e) {
                    ball.endDrag();
                });



                scope.$on("$destroy", function() {
                    if (rafId) {
                        $window.cancelAnimationFrame(rafId);
                        actuator.destroy();
                    }
                });
            }
        };
    }
);