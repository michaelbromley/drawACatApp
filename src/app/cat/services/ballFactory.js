/**
 * Created by Michael on 15/03/14.
 */
angular.module('drawACat.cat.services')

    .factory('ballFactory', function($window, $timeout) {

        var Ball = function(newRadius, imageUrl) {
            var image = new Image();
            image.src = imageUrl;
            var windowHeight = $window.innerHeight;
            var windowWidth = $window.innerWidth;
            var ballDamping = 0.7;
            var G = 0.5; // gravity
            var MAX_VELOCITY = 25;
            var FRICTION = 30; // higher is more slippery

            var dragMode = false;
            var radius = newRadius;
            var x = 100;
            var y = windowHeight - 100;
            var vx = 0;
            var vy = 0;
            var angle = 0;
            var angularVelocity = 0.01;

            this.windowResized = function() {
                windowHeight = $window.innerHeight;
                windowWidth = $window.innerWidth;
            };

            this.getImage = function() {
                return image;
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
            this.getVx = function() {
                return vx;
            };
            this.setVx = function(newVx) {
               setVx(newVx);
            };
            var setVx = function(newVx) {
                if (0 < newVx) {
                    vx = Math.min(newVx, MAX_VELOCITY);
                } else {
                    vx = Math.max(newVx, -MAX_VELOCITY);
                }
            };
            this.getVy = function() {
                return vy;
            };
            this.setVy = function(newVy) {
                setVy(newVy);
            };
            var setVy = function(newVy) {
                if (0 < newVy) {
                    vy = Math.min(newVy, MAX_VELOCITY);
                } else {
                    vy = Math.max(newVy, -MAX_VELOCITY);
                }
            };
            this.getAngle = function() {
                return angle;
            };
            this.getAngularVelocity = function() {
                return angularVelocity;
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
                var collided = false;
                var bb = part.getBoundingBox();
                // is it within the x bounds of the part?
                if (bb.x < x && x < (bb.x + bb.width)) {
                    // is it within the y bounds too?
                    if (bb.y < y && y < (bb.y + bb.height)) {
                        if (!disableCollisions) {
                            collided = true;

                            setVx(vx + part.vx);
                            setVy(vy + part.vy);
                            // add some occasional extra -vy to make the ball more bouncy and fun
                            if (Math.random() < 0.8) {
                                setVy(vy - Math.random() * 20);
                            }
                            disableCollisions = true;
                            $timeout(function() {
                                disableCollisions = false;
                            }, 500);
                        }
                    }
                }
                return collided;
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

                    // update the position
                    vy += G;
                    y += Math.round(vy);
                    vx *= 0.995;
                    x += vx;

                    // update the rotation
                    angle += angularVelocity;

                    // hit the floor
                    if (y + radius >= windowHeight) {
                        if (0 < vy) {
                            y = windowHeight - radius;
                            setVy(vy * -ballDamping);
                            setAngularVelocity(vx);
                        }
                    }
                    // hit the right wall
                    if (x + radius >= windowWidth) {
                        if (0 < vx) {
                            x = windowWidth - radius;
                            setVx(vx * -ballDamping);
                            setAngularVelocity(-vy);
                        }
                    }
                    // hit the left wall
                    if (x - radius <= 0) {
                        if (0 > vx) {
                            x = radius;
                            setVx(vx * -ballDamping);
                            setAngularVelocity(vy);
                        }
                    }
                }
            };

            var setAngularVelocity = function(v) {
                angularVelocity = v / FRICTION;
            };
        };


        return {
            newBall: function(radius, imageUrl) {
                return new Ball(radius, imageUrl);
            }
        };
    });