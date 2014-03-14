/**
 * Created by Michael on 10/03/14.
 */

angular.module('drawACat.cat.services')
/**
 * Te actuator service is responsible for all the macro behaviours of the cat such as blinking, meowing, and so on.
 */
    .factory('actuator', function($timeout, noise) {

        var cat;
        var actuatorFunctions = [];
        var timeoutRef;

        /**
         * Helper function to return the behaviour object of the specified partName
         * @param partName
         * returns {.head.behaviour|*|.eyesOpen.behaviour|.eyesClosed.behaviour|.mouthOpen.behaviour|.mouthClosed.behaviour}
         */
        var b = function(partName) {
            return cat.bodyParts[partName].behaviour;
        };

        /**
         * Master loop that runs all the actuator() functions that have been added to the actuatorFunctions array.
         */
        var actuatorLoop = function() {
            angular.forEach(actuatorFunctions, function(functionName) {
                functionName.actuate();
            });

            timeoutRef = $timeout(actuatorLoop, 16);
        };


        /**
         * Cause random blinking
         * @returns {{actuate: actuate}}
         */
        var actuateBlinking = function() {
            // test some random blinking
            return {
                actuate: function() {
                    if (Math.random() < 0.01) {
                        closeEyes();
                        $timeout(openEyes, 200);
                    }
                }
            };
        };


        /**
         * Cause the range value of the legs to be randomly modulated according to Perlin noise.
         * This creates the effect of natural movement of the legs.
         */
        var actuateLegs = function() {
            // store the original range value for each leg, so we can multiply it by the
            // noise factor to get a modulated value.
            b('leftLeg').rangeOriginal = b('leftLeg').range;
            b('rightLeg').rangeOriginal = b('rightLeg').range;

            var i = 1;

            var leftLegNoise = noise.newGenerator();
            leftLegNoise.setFrequency(0.1);
            var rightLegNoise = noise.newGenerator();
            rightLegNoise.setFrequency(0.1);

            return {
                actuate: function() {
                    b('leftLeg').range = leftLegNoise.getVal(i) * b('leftLeg').rangeOriginal;
                    b('rightLeg').range = rightLegNoise.getVal(i) * b('rightLeg').rangeOriginal;
                    i ++;
                }
            };
        };

        var actuateHead = function() {
            b('head').rangeOriginal = b('head').range;
            var i = 1;

            var headNoise = noise.newGenerator();
            headNoise.setFrequency(0.05);

            return {
                actuate: function() {
                    var dampenedNoise = headNoise.getVal(i)/2 + 0.5;
                    b('head').range = dampenedNoise * b('head').rangeOriginal;
                    i++;
                }
            };
        };

        var closeEyes = function() {
            cat.bodyParts.eyesOpen.behaviour.visible = false;
            cat.bodyParts.eyesClosed.behaviour.visible = true;
        };
        var openEyes = function() {
            cat.bodyParts.eyesOpen.behaviour.visible = true;
            cat.bodyParts.eyesClosed.behaviour.visible = false;
        };

        var closeMouth = function(){
            cat.bodyParts.mouthOpen.behaviour.visible = false;
            cat.bodyParts.mouthClosed.behaviour.visible = true;
        };
        var openMouth = function(){
            cat.bodyParts.mouthOpen.behaviour.visible = true;
            cat.bodyParts.mouthClosed.behaviour.visible = false;
        };


        return {
            init: function(newCat) {
                cat = newCat;
                // set the initial state of the cat
                openEyes();
                closeMouth();

                // register the functions that will run the in main actuatorLoop
                actuatorFunctions.push(actuateLegs());
                actuatorFunctions.push(actuateBlinking());
                actuatorFunctions.push(actuateHead());

                actuatorLoop();
            },
            destroy: function() {
                $timeout.cancel(timeoutRef);
            }
        };

    });