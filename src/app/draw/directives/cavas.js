/**
 * Created by Michael on 07/03/14.
 */

angular.module('drawACat.draw.directives', [])

    .directive('dacCanvas', function(primitives, renderer, DRAW_GUIDE_IMAGES) {

        var getMousePositionFromEvent = function(event) {
            var x = event.pageX - event.target.getBoundingClientRect().left;
            var y = event.pageY - event.target.getBoundingClientRect().top;
            return {
                x: x,
                y: y
            };
        };

        return {
            restrict: 'E',
            templateUrl: 'draw/directives/canvas.tpl.html',
            replace: true,
            link: function(scope) {
                var STROKE_ACTIVE = '#cc3333';
                var STROKE_REGULAR = '#333333';
                var STROKE_DIMMED = 'rgba(0, 0, 0, 0.2)';
                var FILL_VISIBLE = 'rgba(204, 51, 51, 0.2)';
                var FILL_TRANSPARENT = 'rgba(0, 0, 0, 0)';

                var currentLine;
                var mouseIsDown = false;
                var _renderer = renderer.Init(document.getElementById('canvas'));

                function refreshCanvas() {
                    _renderer.clearCanvas();

                    // render the parts that have already been saved
                    angular.forEach(scope.catParts, function(part, partName) {
                        var isCurrentStep = partName === scope.currentStep;
                        if (!isCurrentStep && part.lineCollection) {
                            setStrokeStyle(partName);
                            setFillStyle(partName);
                            _renderer.renderPath(part.lineCollection.getPath());
                        }
                    });

                    // render the current step being drawn
                    _renderer.strokeStyle(STROKE_ACTIVE);
                    setFillStyle(scope.currentStep);
                    _renderer.renderPath(scope.lineCollection.getPath());
                }

                function setStrokeStyle(partName) {
                    // control the dimming of eyes and mouth when drawing the open/closed counterparts
                    var dimOpenEyes = (scope.currentStep === 'eyesClosed' && partName == 'eyesOpen');
                    var dimClosedMouth = (scope.currentStep === 'mouthOpen' && partName == 'mouthClosed');
                    if (dimOpenEyes || dimClosedMouth || partName === 'eyesClosed' || partName == 'mouthOpen') {
                        _renderer.strokeStyle(STROKE_DIMMED);
                    } else {
                        _renderer.strokeStyle(STROKE_REGULAR);
                    }
                }
                function setFillStyle(partName) {
                    // show a fill when drawing parts that should ideally be filled - head and legs
                    var shouldBeFilled = (partName === 'head' || partName === 'leftLeg' || partName === 'rightLeg');
                    if (shouldBeFilled && scope.currentStep === partName) {
                        _renderer.fillStyle(FILL_VISIBLE);
                    } else {
                        _renderer.fillStyle(FILL_TRANSPARENT);
                    }
                }

                scope.$watch(function(scope) {
                    return scope.currentStep;
                }, function() {
                    refreshCanvas();
                    scope.guideImage = DRAW_GUIDE_IMAGES[scope.currentStep];
                });

                scope.$watch(function(scope) {
                    // capture when "undo" is pressed
                    return scope.lineCollection.count();
                }, function(newVal, oldVal) {
                    if (newVal < oldVal) {
                        refreshCanvas();
                    }
                });


                scope.mouseDownHandler = function(event) {
                    currentLine = primitives.Line();

                    var mousePosition = getMousePositionFromEvent(event);
                    currentLine.addPoint(mousePosition.x, mousePosition.y);
                    _renderer.strokeStyle(STROKE_ACTIVE);
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
                    refreshCanvas();
                };

            }
        };
    });