/**
 * Created by Michael on 16/03/14.
 */
angular.module('drawACat.cat.services')

.factory('emotion', function() {
        var MAX_MOOD = 20;
        var MIN_MOOD = -20;
        var HAPPY_THRESHOLD = 10;
        var ANGRY_THRESHOLD = -10;
        var EXCITED_THRESHOLD = 10;
        var BORED_THRESHOLD = -10;
        var happy = 0;
        var excited = 0;


        return {
            getHappier: function() {
                if (happy < MAX_MOOD) {
                    happy ++;
                }
            },
            getAngrier: function() {
                if (MIN_MOOD < happy) {
                    happy --;
                }
            },
            getExcited: function() {
                if (excited < MAX_MOOD) {
                    excited ++;
                }
            },
            getBored: function() {
                if (MIN_MOOD < excited) {
                    excited --;
                }
            },
            calmDown: function() {
                if (0 < happy) {
                    happy -= 0.016;
                } else {
                    happy += 0.016;
                }

                if (0 < excited) {
                    excited -= 0.016;
                } else {
                    excited += 0.016;
                }
            },
            isHappy: function() {
                var isHappy = HAPPY_THRESHOLD < happy;

            },
            isAngry: function() {
                var isAngry = happy < ANGRY_THRESHOLD;
            },
            getMoodValue: function() {
                var happiness = Math.round(happy);
                var excitedness= Math.round(excited);
                return {
                    happiness: happiness,
                    excitedness: excitedness
                };
            }
        };
    });