/**
 * Created by Michael on 14/03/14.
 */

angular.module('drawACat.draw.services')
/**
 * This service is used to control the sequence in which the parts of the cat are drawn. It also contains pre-configured settings which are used to
 * set up the new cat instance.
 */
.factory('drawHelper', function() {

        var catParts = {
            head: {
                label: 'Head',
                behaviour:{
                    sensitivity: {
                        xSkew: 0.25,
                        ySkew: 0.25,
                        xOffset: -0.05,
                        rotation: 0.1
                    },
                    range: 550
                }
            },
            eyesOpen: {
                label: 'Eyes Open',
                parentPart: 'head'
            },
            eyesClosed: {
                label: 'Eyes Closed',
                parentPart: 'head',
                visible: false
            },
            mouthOpen: {
                label: 'Mouth Open',
                parentPart: 'head',
                visible: false
            },
            mouthClosed: {
                label: 'Mouth Closed',
                parentPart: 'head'
            },
            body: {
                label: 'Body',
                behaviour:{
                    sensitivity: {
                        xSkew: 0.01,
                        ySkew: 0.15,
                        xOffset: -0.01,
                        yOffset: -0.03,
                        rotation: 0
                    },
                    range: 300
                }
            },
            leftLeg: {
                label: 'Left Leg',
                behaviour:{
                    sensitivity: {
                        xSkew: 0.2,
                        ySkew: 0.4,
                        xOffset: 0.6,
                        yOffset: 0.6,
                        rotation: 0.4
                    },
                    range: 200
                }
            },
            rightLeg: {
                label: 'Right Leg',
                behaviour:{
                    sensitivity: {
                        xSkew: 0.2,
                        ySkew: 0.4,
                        xOffset: 0.6,
                        yOffset: 0.6,
                        rotation: 0.4
                    },
                    range: 200
                }
            }
        };
        var partKeys = [
            'head',
            'eyesOpen',
            'eyesClosed',
            'mouthOpen',
            'mouthClosed',
            'body',
            'leftLeg',
            'rightLeg'
        ];
        var currentPartIndex = 0;

        return {
            catParts: catParts,
            getCurrentPartLabel: function() {
                if (currentPartIndex < partKeys.length) {
                    var currentPartKey = partKeys[currentPartIndex];
                    return catParts[currentPartKey].label;
                } else {
                    return 'end';
                }
            },
            getCurrentPartKey: function() {
                if (currentPartIndex < partKeys.length) {
                return partKeys[currentPartIndex];
                } else {
                    return 'end';
                }
            },
            next: function() {
                currentPartIndex ++;
            },
            reset: function() {
                currentPartIndex = 0;
            }
        };
    })


;