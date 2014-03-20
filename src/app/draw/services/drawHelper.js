/**
 * Created by Michael on 14/03/14.
 */

angular.module('drawACat.draw.services')
/**
 * This service is used to control the sequence in which the parts of the cat are drawn. It also contains pre-configured settings which are used to
 * set up the new cat instance.
 */
    .factory('drawHelper', function() {

        var catPartsTemplate = function() {
            return {
                head: {
                    label: 'Head',
                    lineCollection: false,
                    behaviour:{
                        sensitivity: {
                            xSkew: 0.25,
                            ySkew: 0.25,
                            xOffset: -0.05,
                            rotation: 0.1
                        },
                        range: 550
                    },
                    done: false
                },
                eyesOpen: {
                    label: 'Eyes Open',
                    lineCollection: false,
                    parentPart: 'head',
                    done: false
                },
                eyesClosed: {
                    label: 'Eyes Closed',
                    lineCollection: false,
                    parentPart: 'head',
                    visible: false,
                    done: false
                },
                mouthOpen: {
                    label: 'Mouth Open',
                    lineCollection: false,
                    parentPart: 'head',
                    visible: false,
                    done: false
                },
                mouthClosed: {
                    label: 'Mouth Closed',
                    lineCollection: false,
                    parentPart: 'head',
                    done: false
                },
                body: {
                    label: 'Body',
                    lineCollection: false,
                    behaviour:{
                        sensitivity: {
                            xSkew: 0.01,
                            ySkew: 0.05,
                            xOffset: -0.01,
                            yOffset: -0.02,
                            rotation: 0
                        },
                        range: 300
                    },
                    done: false
                },
                leftLeg: {
                    label: 'Left Leg',
                    lineCollection: false,
                    behaviour:{
                        sensitivity: {
                            xSkew: 0.2,
                            ySkew: 0.4,
                            xOffset: 0.6,
                            yOffset: 0.6,
                            rotation: 0.4
                        },
                        range: 200
                    },
                    done: false
                },
                rightLeg: {
                    label: 'Right Leg',
                    lineCollection: false,
                    behaviour:{
                        sensitivity: {
                            xSkew: 0.2,
                            ySkew: 0.4,
                            xOffset: 0.6,
                            yOffset: 0.6,
                            rotation: 0.4
                        },
                        range: 200
                    },
                    done: false
                }
            };
        };
        var catParts = catPartsTemplate();
        var partKeys = [
            'head',
            'eyesOpen',
            'eyesClosed',
            'mouthClosed',
            'mouthOpen',
            'body',
            'leftLeg',
            'rightLeg'
        ];
        var currentPartIndex = 0;

        return {
            catParts: catParts,
            partKeys: partKeys,
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
                if (currentPartIndex < partKeys.length - 1) {
                    currentPartIndex ++;
                }
            },
            previous: function() {
                if (0 < currentPartIndex) {
                    currentPartIndex --;
                }
            },
            reset: function() {
                currentPartIndex = 0;
                this.catParts = catPartsTemplate();
            }
        };
    })


;