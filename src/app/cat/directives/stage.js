/**
 * Created by Michael on 10/03/14.
 */

angular.module('drawACat.cat.stage', [])

    .directive('dacStage', function($window, $document, $timeout, renderer, transformer, rafPolyfill) {

        return {
            restrict: 'E',
            templateUrl: 'cat/directives/stage.tpl.html',
            replace: true,
            scope: {
                cat: '='
            },
            link: function(scope, element) {

                var rafId;
                rafPolyfill.run(); // polyfill the $window.requestAnimationFrame method

                var renderFrame = function() {
                    // test some random blinking
                    var isBlinking = scope.cat.bodyParts.eyesClosed.behaviour.visible === true;
                    if (Math.random() < 0.01 && !isBlinking) {
                        scope.cat.blink(500);
                    }


                    _renderer.clearCanvas();
                    transformer.transform(scope.cat, scope.x, scope.y);
                    _renderer.renderCat(scope.cat);
                    rafId = $window.requestAnimationFrame(renderFrame);
                    //setTimeout(renderFrame, 16);
                };

                scope.cat.openEyes();
                scope.cat.closeMouth();
                //setInterval(renderFrame, 16);

                $document.on('mousemove', function(e) {
                    var stageRect = element[0].getBoundingClientRect();
                    scope.x = e.clientX - stageRect.left;
                    scope.y = e.clientY - stageRect.top;
                });

                var _renderer = renderer.Init(element.children()[0]);
                scope.x = 0;
                scope.y = 0;

                renderFrame();

                scope.$on("$destroy", function() {
                    if (rafId) {
                        $window.cancelAnimationFrame(rafId);
                    }
                });

            }
        };
    }
);