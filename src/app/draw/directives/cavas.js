/**
 * Created by Michael on 07/03/14.
 */

angular.module('drawACat.draw.directives', [])

    .directive('dacCanvas', function(primitives, renderer) {

        var getMousePositionFromEvent = function(event) {
            var x = event.pageX - event.target.offsetLeft;
            var y = event.pageY - event.target.offsetTop;
            return {
                x: x,
                y: y
            };
        };

        return {
            restrict: 'E',
            templateUrl: 'draw/directives/canvas.tpl.html',
            replace: true,
            scope: {
                lineCollection: '='
            },
            link: function(scope, element) {

                var currentLine;
                var mouseIsDown = false;
                var _renderer = renderer.Init(element[0]);

                scope.$watch(function(scope) {
                    return scope.lineCollection.count();
                }, function() {
                    _renderer.clearCanvas();
                    _renderer.renderPath(scope.lineCollection.getPath());
                });

                scope.mouseDownHandler = function(event) {
                    currentLine = primitives.Line();

                    var mousePosition = getMousePositionFromEvent(event);
                    currentLine.addPoint(mousePosition.x, mousePosition.y);
                    _renderer.drawStart(mousePosition.x, mousePosition.y);

                    mouseIsDown = true;
                };

                scope.mouseMoveHandler = function(event) {
                    if (mouseIsDown) {
                        var mousePosition = getMousePositionFromEvent(event);
                        currentLine.addPoint(mousePosition.x, mousePosition.y);
                        _renderer.drawMove(mousePosition.x, mousePosition.y);
                    }
                };

                scope.mouseUpHandler = function() {
                    mouseIsDown = false;

                    scope.lineCollection.addLine(currentLine);
                    console.log(scope.lineCollection.getPath());
                };

            }
        };
    });