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

                var rafId;
                actuator.init(scope.cat);

                var renderFrame = function() {
                    _renderer.clearCanvas();
                    transformer.transform(scope.cat, scope.x, scope.y);
                    _renderer.renderCat(scope.cat);
                    rafId = $window.requestAnimationFrame(renderFrame);
                };


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
                        actuator.destroy();
                    }
                });

            }
        };
    }
);