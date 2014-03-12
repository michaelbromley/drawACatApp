/**
 * Created by Michael on 10/03/14.
 */

angular.module('drawACat.cat.transformer', [])

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
         *
         * @param x
         * @param y
         */
        var calculateRangeFactor = function(pointerX, pointerY) {
            var relativeXOffset = pointerX - currentPart.getTransformationData().centreX;
            var relativeYOffset = pointerY - currentPart.getTransformationData().centreY;
            var distanceFromCentre = Math.sqrt(Math.pow(relativeXOffset, 2) + Math.pow(relativeYOffset, 2));

            // TODO: rather than a binary 0/1, this should gradually change from 1 to 0 at the edge of the range
            if (distanceFromCentre > range) {
                rangeFactor = 0;
            } else {
                rangeFactor = 1;
            }
        };

        /**
         * Transform the x and y offset to make the part move towards the pointer.
         *
         * @param pointerX
         * @param pointerY
         */
        var setOffset = function(pointerX, pointerY) {
            var relativeXOffset = pointerX - currentPart.getTransformationData().centreX;
            var relativeYOffset = pointerY - currentPart.getTransformationData().centreY;

            var deltaX = relativeXOffset * sensitivity.xOffset * rangeFactor;
            var deltaY = relativeYOffset * sensitivity.yOffset * rangeFactor;

            currentPart.setXOffset(deltaX);
            currentPart.setYOffset(deltaY);
        };

        var setSkew = function(pointerX, pointerY) {
            var relativeXOffset = pointerX - currentPart.getTransformationData().centreX;
            var relativeYOffset = pointerY - currentPart.getTransformationData().centreY;

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