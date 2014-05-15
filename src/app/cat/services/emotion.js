/**
 * Created by Michael on 16/03/14.
 */
angular.module('drawACat.cat.services')

    .factory('emotion', function($timeout) {
        // emotional constants
        var MAX_MOOD = 20;
        var MIN_MOOD = -20;
        var HAPPY_THRESHOLD = 15;
        var ANGRY_THRESHOLD = -10;
        var EXCITED_THRESHOLD = 15;
        var BORED_THRESHOLD = -10;
        var ATTENTION_SPAN_IN_SECONDS = 10;

        var happy = 0;
        var excited = 0;
        var timeSinceAnythingHappened = 0;
        var isBeingStroked = false;

        var timerId;
        function emotionLoop() {
            timeSinceAnythingHappened ++;

            if (ATTENTION_SPAN_IN_SECONDS < timeSinceAnythingHappened) {
                getBored();
            } else if (excited < EXCITED_THRESHOLD) {
                calmDown();
            }
            if (EXCITED_THRESHOLD < excited) {
                // being excited also sometimes makes a cat feel happy too
                var happyVal = (happy - HAPPY_THRESHOLD) / (MAX_MOOD - HAPPY_THRESHOLD);
                if (Math.random() > happyVal / 2 + 0.5) {
                    getHappier();
                }
            }
            if (HAPPY_THRESHOLD < happy) {
                // cat constantly gets less happy slowly
                if (Math.random() < 0.4) {
                    calmDown();
                }
            } else if (0 < happy) {
                // cat constantly gets less happy slowly
                if (Math.random() < 0.3) {
                    calmDown();
                }
            }
            if (excited < BORED_THRESHOLD) {
                // being bored makes the cat start to get angry
                getAngrier();
            }
            if (0 < excited) {
                // cat constantly gets bored slowly
                if ((timeSinceAnythingHappened + 1) % 3 === 0) {
                    getBored();
                }
            }

            if (isBeingStroked) {
                // being stoked obviously makes the cat 100% happy
                happy = MAX_MOOD;
            }

            timerId = $timeout(emotionLoop, 1000);
        }

        function getHappier() {
            if (happy < MAX_MOOD) {
                happy ++;
            }
        }
        function calmDown() {
            if (0 < happy) {
                happy --;
            }
        }
        function getAngrier() {
            if (MIN_MOOD < happy) {
                happy --;
            }
        }
        function getExcited() {
            if (excited < 0) {
                excited += 2;
            } else if (excited < MAX_MOOD) {
                excited += 0.5;
            }
            if (happy < 0) {
                happy += 3;
            }
            timeSinceAnythingHappened = 0;
        }
        function getBored() {
            if (EXCITED_THRESHOLD < excited) {
                excited -= 2;
            } else if (MIN_MOOD < excited) {
                excited --;
            }
        }


        return {
            getHappier: getHappier,
            getAngrier: getAngrier,
            getExcited: getExcited,
            getBored: getBored,
            isHappy: function() {
                return HAPPY_THRESHOLD < happy;
            },
            isAngry: function() {
                return happy < ANGRY_THRESHOLD;
            },
            isExcited: function() {
                return EXCITED_THRESHOLD < excited;
            },
            isBored: function() {
                return excited < BORED_THRESHOLD;
            },
            startStroking: function() {
                isBeingStroked = true;
            },
            stopStroking: function() {
                if (isBeingStroked) {
                    isBeingStroked = false;
                    happy = 18;
                }
            },
            getMoodValue: function() {
                var happyVal = (happy - HAPPY_THRESHOLD) / (MAX_MOOD - HAPPY_THRESHOLD);
                var angryVal = (happy - ANGRY_THRESHOLD) / (MIN_MOOD - ANGRY_THRESHOLD);
                var excitedVal = (excited - EXCITED_THRESHOLD) / (MAX_MOOD - EXCITED_THRESHOLD);
                var boredVal = (excited - BORED_THRESHOLD) / (MIN_MOOD - BORED_THRESHOLD);
                return {
                    happy: Math.max(happyVal, 0),
                    angry: Math.max(angryVal, 0),
                    excited: Math.max(excitedVal, 0),
                    bored: Math.max(boredVal, 0)
                };
            },
            start: function() {
                emotionLoop();
            },
            stop: function() {
                $timeout.cancel(timerId);
            },
            reset: function(){
                $timeout.cancel(timerId);
                happy = 0;
                excited = 0;
                timeSinceAnythingHappened = 0;
                isBeingStroked = false;
            }
        };
    });