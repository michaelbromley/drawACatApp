/**
 * Created by Michael on 07/03/14.
 */

angular.module('drawACat.draw.directives', [])

    .directive('dacCanvas', function($window, primitives, renderer, DRAW_GUIDE_IMAGES) {

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

                var rafId;
                var currentLine;
                var mouseIsDown = false;
                var canvas = document.getElementById('canvas');
                renderer.setCanvas(canvas);
                renderer.lineWidth(2);

                function refreshCanvas() {
                    renderer.clearCanvas();

                    // render the parts that have already been saved
                    angular.forEach(scope.catParts, function(part, partName) {
                        var isCurrentStep = partName === scope.currentStep;
                        if (!isCurrentStep && part.lineCollection) {
                            setStrokeStyle(partName);
                            setFillStyle(partName);
                            renderer.renderPath(part.lineCollection.getPath());
                        }
                    });

                    if (currentLine) {
                        var lineBeingDrawn = currentLine.getPath();
                        if (0 < lineBeingDrawn.length) {
                            renderer.strokeStyle(STROKE_ACTIVE);
                            renderer.fillStyle(FILL_TRANSPARENT);
                            renderer.renderSingleLine(lineBeingDrawn);
                            renderer.fillStyle(FILL_VISIBLE);
                        }
                    }

                    // render the current step being drawn
                    renderer.strokeStyle(STROKE_ACTIVE);
                    setFillStyle(scope.currentStep);
                    renderer.renderPath(scope.lineCollection.getPath());

                    rafId = $window.requestAnimationFrame(refreshCanvas);
                }
                refreshCanvas();

                function setStrokeStyle(partName) {
                    // control the dimming of eyes and mouth when drawing the open/closed counterparts
                    var dimOpenEyes = (scope.currentStep === 'eyesClosed' && partName == 'eyesOpen');
                    var dimClosedMouth = (scope.currentStep === 'mouthOpen' && partName == 'mouthClosed');
                    if (dimOpenEyes || dimClosedMouth || partName === 'eyesClosed' || partName == 'mouthOpen') {
                        renderer.strokeStyle(STROKE_DIMMED);
                    } else {
                        renderer.strokeStyle(STROKE_REGULAR);
                    }
                }
                function setFillStyle(partName) {
                    // show a fill when drawing parts that should ideally be filled - head and legs
                    var shouldBeFilled = (partName === 'head' || partName === 'leftLeg' || partName === 'rightLeg');
                    if (shouldBeFilled && scope.currentStep === partName) {
                        renderer.fillStyle(FILL_VISIBLE);
                    } else {
                        renderer.fillStyle(FILL_TRANSPARENT);
                    }
                }

                /**
                 * The whole drawing is completed if all parts except the current one are set to "done", and the current part has at least one line it its lineCollection
                 * @returns {boolean}
                 */
                function checkCompleted() {
                    var result = true;
                    angular.forEach(scope.catParts, function(catPart, partName) {
                        if (partName === scope.currentStep) {
                            if (scope.lineCollection.count() === 0) {
                                result = false;
                            }
                        } else if (!catPart.done) {
                            result =  false;
                        }
                    });
                    return result;
                }

                scope.$watch(function(scope) {
                    return scope.currentStep;
                }, function() {
                    scope.guideImage = DRAW_GUIDE_IMAGES[scope.currentStep];
                });

                scope.$watch(function(scope) {
                    // capture when "undo" is pressed
                    return scope.lineCollection.count();
                }, function(newVal, oldVal) {
                    if (newVal < oldVal) {
                    }
                });


                scope.undo = function() {
                    scope.lineCollection.removeLine();
                    scope.drawing.completed = checkCompleted();
                };


                scope.mouseDownHandler = function(event) {
                    currentLine = primitives.Line();

                    var mousePosition = getMousePositionFromEvent(event);
                    currentLine.addPoint(mousePosition.x, mousePosition.y);
                    mouseIsDown = true;
                };

                scope.mouseMoveHandler = function(event) {
                    if (mouseIsDown) {
                        // if the pointer has gone off the edge of the canvas, we should treat it like a mouseup
                        if (event.target != canvas) {
                            mouseIsDown = false;
                        } else {
                            var mousePosition = getMousePositionFromEvent(event);
                            currentLine.addPoint(mousePosition.x, mousePosition.y);
                        }
                    }
                };

                scope.mouseUpHandler = function() {
                    mouseIsDown = false;

                    if (1 < currentLine.getPath().length) {
                        scope.lineCollection.addLine(currentLine);
                        currentLine = null;
                        scope.drawing.completed = checkCompleted();
                    }
                };

                scope.$on("$destroy", function() {
                    if (rafId) {
                        $window.cancelAnimationFrame(rafId);
                    }
                });

            }
        };
    });