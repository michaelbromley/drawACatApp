/**
 * Created by Michael on 15/03/14.
 */
angular.module('drawACat.cat.services')

    .factory('ballFactory', function($window, $timeout) {
        var Ball = function(newRadius) {
            var windowHeight = $window.innerHeight;
            var windowWidth = $window.innerWidth;
            var ballDamping = 0.7;
            var G = 0.5; // gravity
            var MAX_ACCELLERATION = 20;

            var dragMode = false;
            var radius = newRadius;
            var x = 100;
            var y = 100;
            var ax = 30;
            var ay = 0;

            this.windowResized = function() {
                windowHeight = $window.innerHeight;
                windowWidth = $window.innerWidth;
            };
            this.getRadius = function() {
                return radius;
            };
            this.getX = function() {
                return x;
            };
            this.setX = function(newX) {
                x = newX;
            };
            this.getY = function() {
                return y;
            };
            this.setY = function(newY) {
                y = newY;
            };
            this.getAx = function() {
                return ax;
            };
            this.setAx = function(newAx) {
                ax = Math.min(newAx, MAX_ACCELLERATION);
            };
            this.getAy = function() {
                return ay;
            };
            this.setAy = function(newAy) {
                ay = Math.min(newAy, MAX_ACCELLERATION);
            };

            /**
             * detect whether the pointer (mouse, touch) is currently over the ball.
             * @param pointerX
             * @param pointerY
             * @returns {boolean}
             */
            this.pointerIsOver = function(pointerX, pointerY) {
                var deltaX = Math.abs(x - pointerX);
                var deltaY = Math.abs(y - pointerY);
                var distanceFromBallCentre = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                return (distanceFromBallCentre <= radius);
            };

            var disableCollisions;
            this.checkPartCollision = function(part) {
                var bb = part.getBoundingBox();
                // is it within the x bounds of the part?
                if (bb.x < x && x < (bb.x + bb.width)) {
                    // is it within the y bounds too?
                    if (bb.y < y && y < (bb.y + bb.height)) {
                        if (!disableCollisions) {
                            ax += part.ax;
                            ay += part.ay;
                            // add some occasional extra -ay to make the ball more bouncy and fun
                            if (Math.random() < 0.8) {
                                ay -= Math.random() * 20;
                                console.log('random bounce! ball.ay = ' + ay);
                            }
                            disableCollisions = true;
                            $timeout(function() {
                                disableCollisions = false;
                            }, 500);
                        }
                    }
                }
            };

            this.isInDragMode = function() {
                return dragMode;
            };
            this.startDrag = function() {
                dragMode = true;
                console.log('drag start');
            };
            this.endDrag = function() {
                dragMode = false;
                console.log('drag end');
            };

            this.updatePosition = function() {
                if (!dragMode) {
                    ay += G;
                    y += Math.round(ay);

                    ax *= 0.995;
                    x += ax;

                    // hit the floor
                    if (y + radius >= windowHeight) {
                        if (0 < ay) {
                            y = windowHeight - radius;
                            ay *= -ballDamping; // reverse the acceleration
                        }
                    }
                    // hit the right wall
                    if (x + radius >= windowWidth) {
                        if (0 < ax) {
                            x = windowWidth - radius;
                            ax *= - ballDamping;
                        }
                    }
                    // hit the left wall
                    if (x - radius <= 0) {
                        if (0 > ax) {
                            x = radius;
                            ax *= - ballDamping;
                        }
                    }
                }
            };
        };

        return {
            newBall: function(radius) {
                return new Ball(radius);
            }
        };
    });