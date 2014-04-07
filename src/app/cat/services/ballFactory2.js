/**
 * Created by Michael on 15/03/14.
 */
angular.module('drawACat.cat.services')
/**
 * Experiment with a ball that is made of a `part` primitive. Proved to be slower to render then the image-based approach.
 */
    .factory('Ball', function($window, $timeout, primitives, audioPlayer) {

        var Ball = function() {
            this.part = primitives.Part();
            this.part.createFromPath('ball', [[[9.280742459396752,41.76334106728538],[9.280742459396752,45.243619489559165],[9.280742459396752,48.72389791183295],[11.600928074245939,49.88399071925754],[13.921113689095128,52.20417633410673],[16.241299303944317,54.524361948955914],[19.721577726218097,54.524361948955914],[24.361948955916475,54.524361948955914],[27.842227378190255,54.524361948955914],[31.322505800464036,54.524361948955914],[34.80278422273782,54.524361948955914],[38.283062645011604,54.524361948955914],[41.76334106728538,54.524361948955914],[45.243619489559165,54.524361948955914],[48.72389791183295,54.524361948955914],[53.364269141531324,54.524361948955914],[54.524361948955914,52.20417633410673],[56.84454756380511,51.04408352668214],[59.164733178654295,48.72389791183295],[60.324825986078885,46.403712296983755],[63.80510440835267,44.08352668213457],[64.96519721577727,41.76334106728538],[66.12529002320186,39.443155452436194],[67.28538283062645,37.12296983758701],[68.44547563805105,34.80278422273782],[68.44547563805105,31.322505800464036],[69.60556844547564,29.00232018561485],[69.60556844547564,25.52204176334107],[69.60556844547564,22.041763341067284],[69.60556844547564,17.40139211136891],[68.44547563805105,15.081206496519721],[66.12529002320186,12.761020881670534],[64.96519721577727,10.440835266821345],[62.64501160092807,8.120649651972158],[59.164733178654295,8.120649651972158],[55.68445475638051,8.120649651972158],[53.364269141531324,6.960556844547564],[49.88399071925754,5.800464037122969],[46.403712296983755,5.800464037122969],[41.76334106728538,4.640371229698376],[38.283062645011604,4.640371229698376],[34.80278422273782,4.640371229698376],[32.48259860788863,3.480278422273782],[29.00232018561485,3.480278422273782],[25.52204176334107,3.480278422273782],[22.041763341067284,3.480278422273782],[18.561484918793504,3.480278422273782],[15.081206496519721,3.480278422273782],[11.600928074245939,4.640371229698376],[9.280742459396752,5.800464037122969],[6.960556844547564,8.120649651972158],[4.640371229698376,12.761020881670534],[3.480278422273782,15.081206496519721],[2.320185614849188,17.40139211136891],[1.160092807424594,19.721577726218097],[1.160092807424594,23.201856148491878],[0,25.52204176334107],[0,29.00232018561485],[0,32.48259860788863],[0,35.96287703016241],[0,39.443155452436194],[0,42.92343387470998],[2.320185614849188,46.403712296983755],[3.480278422273782,48.72389791183295],[5.800464037122969,51.04408352668214],[8.120649651972158,53.364269141531324],[10.440835266821345,55.68445475638051],[12.761020881670534,58.0046403712297],[16.241299303944317,58.0046403712297],[19.721577726218097,58.0046403712297],[23.201856148491878,58.0046403712297],[27.842227378190255,58.0046403712297],[31.322505800464036,58.0046403712297],[35.96287703016241,58.0046403712297],[38.283062645011604,56.84454756380511],[40.60324825986079,55.68445475638051],[42.92343387470998,54.524361948955914],[44.08352668213457,52.20417633410673],[47.56380510440835,49.88399071925754],[49.88399071925754,48.72389791183295],[51.04408352668214,46.403712296983755],[53.364269141531324,44.08352668213457],[55.68445475638051,41.76334106728538],[56.84454756380511,39.443155452436194],[59.164733178654295,37.12296983758701],[60.324825986078885,32.48259860788863],[61.48491879350348,30.162412993039442],[62.64501160092807,27.842227378190255],[63.80510440835267,25.52204176334107],[63.80510440835267,22.041763341067284],[63.80510440835267,18.561484918793504],[63.80510440835267,15.081206496519721],[63.80510440835267,10.440835266821345],[61.48491879350348,9.280742459396752],[60.324825986078885,6.960556844547564],[56.84454756380511,5.800464037122969],[55.68445475638051,3.480278422273782],[52.20417633410673,2.320185614849188],[48.72389791183295,1.160092807424594],[46.403712296983755,0]]]);
            var windowHeight = $window.innerHeight;
            var windowWidth = $window.innerWidth;
            var ballDamping = 0.7;
            var G = 0.5; // gravity
            var MAX_VELOCITY = 40;
            var FRICTION = -1; // higher is more slippery

            var dragMode = false;
            var diameter = this.part.getTransformationData().width;
            var x = 0;
            var y = windowHeight - 0;
            var vx = 0;
            var vy = 0;
            var angle = 0;
            var angularVelocity = 0.01;

            this.windowResized = function() {
                windowHeight = $window.innerHeight;
                windowWidth = $window.innerWidth;
            };

            this.getX = function() {
                return x;
            };
            this.setX = function(value) {
                x = value;
                this.part.setXOffset(value);
            };
            this.getY = function() {
                return y;
            };
            this.setY = function(value) {
                y = value;
                this.part.setYOffset(value);
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

                return (distanceFromBallCentre <= diameter);
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

            this.updatePosition = function() {
                if (!dragMode) {

                    // update the position
                    vy += G;
                    y += Math.round(vy);

                    vx *= 0.995;
                    x += vx;

                    // update the rotation
                    angle += angularVelocity;

                    var strikeVelocity = 0;
                    // hit the floor
                    if (y + diameter >= windowHeight) {
                        if (0 < vy) {
                            y = windowHeight - diameter;
                            setVy(vy * -ballDamping);
                            setAngularVelocity(vx);
                            strikeVelocity = vy;
                        }
                    }
                    // hit the right wall
                    if (x + diameter >= windowWidth) {
                        if (0 < vx) {
                            x = windowWidth - diameter;
                            setVx(vx * -ballDamping);
                            setAngularVelocity(-vy);
                            strikeVelocity = vx;
                        }
                    }
                    // hit the left wall
                    if (x <= 0) {
                        if (0 > vx) {
                            x = diameter;
                            setVx(vx * -ballDamping);
                            setAngularVelocity(vy);
                            strikeVelocity = vx;
                        }
                    }

                    if (2 < Math.abs(strikeVelocity)) {
                        audioPlayer.ballBounceHard(Math.abs(strikeVelocity));
                    }
                    this.part.setYOffset(y);
                    this.part.setXOffset(x);
                    this.part.setRotation(angle);
                }
            };

            var setAngularVelocity = function(v) {
                angularVelocity = v / FRICTION;
            };
            this.setAngle = function(a) {
                // TODO: this method added purely for testing. Should be refactored to make the API easier to test.
                angle = a;
            };

        };

        return Ball;
    });