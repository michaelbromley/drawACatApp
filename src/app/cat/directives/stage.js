/**
 * Created by Michael on 10/03/14.
 */

angular.module('drawACat.cat.directives')

    .directive('dacStage', function($window, $document, renderer, transformer, actuator) {

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
                scope.x = 0;
                scope.y = 0;

                function resizeCanvas() {
                    var windowWidth = $window.innerWidth;
                    var windowHeight = $window.innerHeight;
                    canvas.width = windowWidth;
                    canvas.height = windowHeight;

                    // move the cat to be in the centre and at the bottom of the canvas
                    var catWidth = scope.cat.getWidth();
                    var catHeight = scope.cat.getHeight();
                    var xAdjustment = (windowWidth / 2) - (catWidth / 2);
                    var yAdjustment = windowHeight - (catHeight + 20);
                    scope.cat.adjustPosition(xAdjustment, yAdjustment);
                }
                resizeCanvas();
                angular.element($window).bind('resize', function() {
                    resizeCanvas();
                });

                var rafId;
                var renderFrame = function() {
                    _renderer.clearCanvas();
                    transformer.transform(scope.cat, scope.x, scope.y);
                    _renderer.renderCat(scope.cat);
                    rafId = $window.requestAnimationFrame(renderFrame);
                };
                renderFrame();

                $document.on('mousemove', function(e) {
                    var stageRect = canvas.getBoundingClientRect();
                    scope.x = e.clientX - stageRect.left;
                    scope.y = e.clientY - stageRect.top;
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