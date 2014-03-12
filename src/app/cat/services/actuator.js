/**
 * Created by Michael on 10/03/14.
 */

angular.module('drawACat.cat.actuator', [])
/**
 * Te actuator service is responsible for all the macro behaviours of the cat such as blinking, meowing, and so on.
 */
    .factory('actuator', function($timeout) {

        var cat;
        
        var blink = function(interval) {
            cat.closeEyes();
            $timeout(function() {
                cat.openEyes();
            }, interval);
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
                openEyes();
                closeMouth();
            },
            blink: blink
        };

    });