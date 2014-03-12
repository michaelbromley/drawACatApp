/**
 * Created by Michael on 08/03/14.
 */
angular.module('drawACat.common.services')

/**
 * This is the service that creates Cat objects. A Cat is a collections of specific Parts, such as head, body, rightLeg, leftLeg etc. Each part has an
 * associated behaviour object that defines how that part responds to events such as user interaction.
 */
    .factory('catFactory', function() {
        var Cat = function() {
            var bodyParts = {};
            bodyParts.head = {};
            bodyParts.eyesOpen = {};
            bodyParts.eyesClosed = {};
            bodyParts.mouthOpen = {};
            bodyParts.mouthClosed = {};
            bodyParts.body = {};
            bodyParts.leftLeg = {};
            bodyParts.rightLeg = {};
            this.bodyParts = bodyParts;
        };

        /**
         * Get a path array for the whole cat, which concatenates each bodyPart path into one big array.
         * @returns {Array}
         */
        Cat.prototype.getPath = function() {
            var path = [];
            for (var key in this.bodyParts) {
                if (this.bodyParts.hasOwnProperty(key)) {
                    if (this.bodyParts[key].part) {
                        var partPath = this.bodyParts[key].part.getPath();
                        path = path.concat(partPath);
                    }
                }
            }
            return path;
        };

        Cat.prototype.blink = function(interval) {
            this.closeEyes();
            var self = this;
            setInterval(function() {
                self.openEyes.apply(self);
            }, interval);
        };

        Cat.prototype.closeEyes = function() {
            this.bodyParts.eyesOpen.behaviour.visible = false;
            this.bodyParts.eyesClosed.behaviour.visible = true;
        };
        Cat.prototype.openEyes = function() {
            this.bodyParts.eyesOpen.behaviour.visible = true;
            this.bodyParts.eyesClosed.behaviour.visible = false;
        };

        Cat.prototype.closeMouth = function(){
            this.bodyParts.mouthOpen.behaviour.visible = false;
            this.bodyParts.mouthClosed.behaviour.visible = true;
        };
        Cat.prototype.openMouth = function(){
            this.bodyParts.mouthOpen.behaviour.visible = true;
            this.bodyParts.mouthClosed.behaviour.visible = false;
        };

        return {
            newCat: function() {
                return new Cat();
            }
        };
    }
);