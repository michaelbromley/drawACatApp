/**
 * Created by Michael on 15/03/14.
 */
angular.module('drawACat.cat.services')

    .factory('Ball', function($window, $timeout, audioPlayer) {

        var BALLS = [
            {
                src: 'assets/images/ball01.png',
                radius: 34
            },
            {
                src: 'assets/images/ball01.png',
                radius: 34
            },
            {
                // ball of wool
                src: 'assets/images/ball02.png',
                radius: 29,
                massFactor: 0.7
            },
            {
                // ball of wool
                src: 'assets/images/ball02.png',
                radius: 29,
                massFactor: 0.7
            },
            {
                // ping pong ball
                src: 'assets/images/ball03.png',
                radius: 25,
                sound: 'ball-bounce-pingpong-01.mp3'
            },
            {
                // ping pong ball
                src: 'assets/images/ball03.png',
                radius: 25,
                sound: 'ball-bounce-pingpong-01.mp3'
            },
            {
                src: 'assets/images/ball04.png',
                radius: 24
            },
            {
                src: 'assets/images/ball04.png',
                radius: 24
            },
            {
                src: 'assets/images/ball05.png',
                radius: 43
            },
            {
                src: 'assets/images/ball05.png',
                radius: 43
            },
            {
                // juggling ball
                src: 'assets/images/ball06.png',
                radius: 36
            },
            {
                // juggling ball
                src: 'assets/images/ball06.png',
                radius: 36
            },
            {
                // dog's head
                src: 'assets/images/ball07.png',
                radius: 44
            },
            {
                // volleyball
                src: 'assets/images/ball08.png',
                radius: 60,
                sound: 'ball-bounce-football-01.mp3'
            },
            {
                // football
                src: 'assets/images/ball09.png',
                radius: 72,
                sound: 'ball-bounce-football-01.mp3'
            },
            {
                // baseball
                src: 'assets/images/ball10.png',
                radius: 33
            },
            {
                // baseball
                src: 'assets/images/ball10.png',
                radius: 33
            },
            {
                // beach ball
                src: 'assets/images/ball11.png',
                radius: 94,
                massFactor: 0.35,
                sound: 'ball-bounce-hollow-01.mp3'
            },
            {
                // bowling ball
                src: 'assets/images/ball12.png',
                radius: 53,
                massFactor: 2,
                sound: 'ball-bounce-bowlingball-01.mp3'
            },
            {
                // cricket ball
                src: 'assets/images/ball13.png',
                radius: 32,
                massFactor: 1.3
            },
            {
                // cricket ball
                src: 'assets/images/ball13.png',
                radius: 32,
                massFactor: 1.3
            }
        ];

        var Ball = function(initX, initY) {
            var image = new Image();
            var ballSource = BALLS[Math.floor(Math.random()*BALLS.length)];
            image.src = ballSource.src;
            var ballSound = ballSource.sound || 'ball-bounce-default-01.mp3';
            audioPlayer.loadBallSound(ballSound);
            var radius = ballSource.radius;
            var windowHeight = $window.innerHeight;
            var windowWidth = $window.innerWidth;
            var ballDamping = 0.7;
            var G = 0.6; // gravity
            var massFactor = ballSource.massFactor || 1;
            var mass = radius / 25 * massFactor;
            var MAX_VELOCITY = 100;
            var FRICTION = 30; // higher is more slippery

            var dragMode = false;

            var x, y;
            if (typeof initX !== 'undefined' && typeof initY !== 'undefined') {
                x = initX;
                y = initY;
            } else {
                x = 100 + Math.random() * 10;
                y = windowHeight - 200;
            }
            var vx = (Math.random() * 2) - 1;
            var vy = 0;
            var angleInRadians = 0;
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
            this.getMass = function() {
                return mass;
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
                return angleInRadians;
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
                                if (0 < part.vy) {
                                    setVy(vy - Math.random() * 20);
                                }
                            }
                            disableCollisions = true;
                            $timeout(function() {
                                disableCollisions = false;
                            }, 500);

                            var velocity = Math.max(Math.abs(vx), Math.abs(vy));
                            audioPlayer.ballBounceSoft(velocity);
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
            };
            this.endDrag = function() {
                dragMode = false;
            };

            /**
             * Based on http://gamedev.stackexchange.com/a/20525
             * @param balls
             */
            this.checkOtherBallCollision = function(balls) {
                // TODO: perhaps only need to check half the balls. Maybe best to move this out of the Ball class. Currently optimization does not seem called for.
                angular.forEach(balls, function(ball) {
                    if (!(x === ball.getX() && y == ball.getY())) { // rule out this ball itself
                        var xDist = x - ball.getX();
                        var yDist = y - ball.getY();
                        var distSquared = xDist*xDist + yDist*yDist;
                        //Check the squared distances instead of the the distances, same result, but avoids a square root.
                        if(distSquared <= (radius + ball.getRadius())*(radius + ball.getRadius())){

                            var xVelocity = ball.getVx() - vx;
                            var yVelocity = ball.getVy() - vy;
                            var dotProduct = xDist*xVelocity + yDist*yVelocity;
                            //Neat vector maths, used for checking if the objects moves towards one another.
                            if(dotProduct > 0){
                                var collisionScale = dotProduct / distSquared;
                                var xCollision = xDist * collisionScale;
                                var yCollision = yDist * collisionScale;
                                //The Collision vector is the speed difference projected on the Dist vector,
                                //thus it is the component of the speed difference needed for the collision.
                                var combinedMass = mass + ball.getMass();
                                var collisionWeightA = 1.7 * Math.pow(ball.getMass(), 1.3) / combinedMass;
                                var collisionWeightB = 1.7 * Math.pow(mass, 1.3) / combinedMass;
                                vx += collisionWeightA * xCollision * 0.9;
                                vy += collisionWeightA * yCollision * 0.9;
                                ball.setVx(ball.getVx() - collisionWeightB * xCollision * 0.5);
                                ball.setVy(ball.getVy() - collisionWeightB * yCollision * 0.5);

                                // alter the rotations
                                angularVelocity = ball.getAngularVelocity() * - 0.9 / mass;
                            }
                        }
                    }
                });
            };

            this.updatePosition = function() {
                if (!dragMode) {
                    // update the position
                    vy += G * mass;
                    y += Math.round(vy);
                    vx *= 0.995;
                    x += vx;

                    // update the rotation
                    angleInRadians = (angleInRadians + angularVelocity) % (2 * Math.PI);

                    var strikeVelocity = 0;
                    // hit the floor
                    if (y + radius >= windowHeight) {
                        if (0 < vy) {
                            y = windowHeight - radius;
                            setVy(vy * -ballDamping);
                            setAngularVelocity(vx);
                            strikeVelocity = vy;
                        }
                    }
                    // hit the right wall
                    if (x + radius >= windowWidth) {
                        if (0 < vx) {
                            x = windowWidth - radius;
                            setVx(vx * -ballDamping);
                            setAngularVelocity(-vy);
                            strikeVelocity = vx;
                        }
                    }
                    // hit the left wall
                    if (x - radius <= 0) {
                        if (0 > vx) {
                            x = radius;
                            setVx(vx * -ballDamping);
                            setAngularVelocity(vy);
                            strikeVelocity = vx;
                        }
                    }

                    if (2 < Math.abs(strikeVelocity)) {
                        audioPlayer.ballBounce(ballSound, Math.abs(strikeVelocity));
                    }
                }
            };

            var setAngularVelocity = function(v) {
                angularVelocity = v / FRICTION / (radius / 25);
            };

        };

        return Ball;
    });