/**
 * Created by Michael on 08/03/14.
 */
angular.module('drawACat.common.services.cat', [])

/**
 * This is the service that creates Cat objects. A Cat is a collections of specific Parts, such as head, body, rightLeg, leftLeg etc. Each part has an
 * associated behaviour object that defines how that part responds to events such as user interaction.
 */
    .factory('cat', function() {
        var Cat = function() {
            this.head = {
                eyes: {},
                mouth: {}
            };
            this.body = {};
            this.leftLeg = {};
            this.rightLeg = {};
        };

        return {
            newCat: function() {
                return new Cat();
            }
        };
    }
);