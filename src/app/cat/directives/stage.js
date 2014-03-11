/**
 * Created by Michael on 10/03/14.
 */

angular.module('drawACat.cat.stage', [])

    .directive('dacStage', function($window, $document, $timeout, renderer, transformer) {

        var requestAnimFrame = (function(){
            return  $window.requestAnimationFrame       ||
                $window.webkitRequestAnimationFrame ||
                $window.mozRequestAnimationFrame    ||
                $window.oRequestAnimationFrame      ||
                $window.msRequestAnimationFrame     ||
                function(/* function */ callback, /* DOMElement */ element){
                    $timeout(callback, 1000 / 60);
                };
        })();

        return {
            restrict: 'E',
            templateUrl: 'cat/directives/stage.tpl.html',
            replace: true,
            scope: {
                cat: '='
            },
            link: function(scope, element) {
                var renderFrame = function() {
                    _renderer.renderCat(scope.cat);
                    //requestAnimFrame(renderFrame);
                };

                $document.on('mousemove', function(e) {
                    console.log('moved');
                    scope.x = e.pageX;
                    scope.y = e.pageY;
                    _renderer.clearCanvas();
                    transformer.transform(scope.cat, scope.x, scope.y);
                    _renderer.renderCat(scope.cat);
                });

                var _renderer = renderer.Init(element.children()[0]);
                scope.x = 0;
                scope.y = 0;

                renderFrame();

            }
        };
    }
);