/**
 * Created by Michael on 10/03/14.
 */

angular.module('drawACat.cat.services')
/**
 * The transformer takes the x & y coordinates of the stimulus (mouse pointer, ball or whatever) and transforms the
 * Parts of the cat to react to it, as defined by that part's behaviour object.
 */
    .factory('transformer', function() {

        var currentPart;
        var sensitivity;
        var range;
        var rangeFactor;

        /**
         * The range factor is a value between 0 and 1 that describes how strongly the behaviour should
         * be applied. The range is a circle around the centre point of the part, inside which the behaviour will
         * be applied (rangeFactor will = 1). Towards the edge of the circle, the value should drop off to 0.
         *
         * @param pointerX
         * @param pointerY
         */
        var calculateRangeFactor = function(pointerX, pointerY) {
            var relativeXOffset = pointerX - currentPart.getTransformationData().centreX;
            var relativeYOffset = pointerY - currentPart.getTransformationData().centreY;
            var distanceFromCentre = Math.sqrt(Math.pow(relativeXOffset, 2) + Math.pow(relativeYOffset, 2));

            if (distanceFromCentre > range) {
                var distanceBeyondRange = distanceFromCentre - range;
                var featherRegion = 100;
                rangeFactor = Math.max(featherRegion - distanceBeyondRange, 0) / featherRegion;
            } else {
                rangeFactor = 1;
            }
        };

        /**
         * Transform the x and y offset to make the part move towards the pointer. Also decorate the part with
         * acceleration values.
         *
         * @param pointerX
         * @param pointerY
         */
        var setOffset = function(pointerX, pointerY) {
            var transformationData = currentPart.getTransformationData();
            var currentXOffset = transformationData.xOffset;
            var currentYOffset = transformationData.yOffset;

            var relativeXOffset = pointerX - transformationData.centreX;
            var relativeYOffset = pointerY - transformationData.centreY;

            var newXOffset = relativeXOffset * sensitivity.xOffset * rangeFactor;
            var newYOffset = relativeYOffset * sensitivity.yOffset * rangeFactor;

            // calculate acceleration and decorate part with the data.
            currentPart.ax = Math.round((newXOffset - currentXOffset) * 2);
            currentPart.ay = Math.round((newYOffset - currentYOffset) * 1);

            currentPart.setXOffset(newXOffset);
            currentPart.setYOffset(newYOffset);
        };

        /**
         * Skew simulates a "rotation" on the z-axis towards or away from the pointer. It is primarily used to make the head
         * "look" towards the pointer.
         * @param pointerX
         * @param pointerY
         */
        var setSkew = function(pointerX, pointerY) {
            var transformationData = currentPart.getTransformationData();
            var relativeXOffset = pointerX - transformationData.centreX;
            var relativeYOffset = pointerY - transformationData.centreY;

            var deltaX = relativeXOffset * sensitivity.xSkew * rangeFactor;
            var deltaY = relativeYOffset * sensitivity.ySkew * rangeFactor;

            currentPart.setXSkew(-deltaX);
            currentPart.setYSkew(-deltaY);
        };

        var setRotation = function(pointerX, pointerY) {
            var relativeYOffset = pointerY - currentPart.getTransformationData().centreY; // not currently used
            var relativeXOffset = pointerX - currentPart.getTransformationData().centreX;

            //var rotation = relativeYOffset * Math.sin(relativeXOffset/200);
            var maxRotation = 90;
            var rotation;

            if (relativeXOffset < -maxRotation) {
                rotation = -maxRotation;
            } else if (relativeXOffset > maxRotation) {
                rotation = maxRotation;
            } else {
                rotation = relativeXOffset;
            }

            var delta = rotation * sensitivity.rotation * rangeFactor;

            currentPart.setRotation(delta);
        };

        var transformBodyPart = function(part, behaviour, x, y) {
            currentPart = part;
            sensitivity = behaviour.sensitivity;
            range = behaviour.range;

            calculateRangeFactor(x, y);
            setOffset(x, y);
            setSkew(x, y);
            setRotation(x, y);
        };


        return {
            transform: function(cat, x, y) {
                angular.forEach(cat.bodyParts, function(bodyPart) {
                    transformBodyPart(bodyPart.part, bodyPart.behaviour, x, y);
                });
            }
        };
});