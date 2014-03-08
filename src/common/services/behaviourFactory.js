/**
 * Created by Michael on 08/03/14.
 */
angular.module('drawACat.common.services.behaviourFactory', [])

    .factory('behaviourFactory', function() {
        /**
         * A Behaviour object defines how a part will respond to user input.
         *
         * Behaviour is defined as how a part reacts to user input. The default behaviour is that
         * a part will not react at all. By setting the parameters of the Behaviour object, we are
         * defining how the transformation data of the part will be affected by the position of the
         * user input. Eg a positive value for xSkew will cause the part to skew towards the pointer or
         * ball or whatever is providing the input data.
         * @constructor
         */
        var Behaviour = function() {

            // the following values should range between -1 ... 1. Default is 0.
            this.sensitivity = {
                xOffset: 0,
                yOffset: 0,
                xSkew: 0,
                ySkew: 0,
                rotation: 0
            };

            this.range = 100;
        };

        Behaviour.prototype.setSensitivity = function(sensitivityObject) {
            for(var key in sensitivityObject) {
                if (sensitivityObject.hasOwnProperty(key)) {
                    this.sensitivity[key] = sensitivityObject[key];
                }
            }
        };

        return {
            newBehaviour: function() {
                return new Behaviour();
            }
        };
    }
);