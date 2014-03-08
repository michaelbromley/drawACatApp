/**
 * Created by Michael on 08/03/14.
 */
angular.module('drawACat.common.services.serializer', [])

    .factory('serializer', function() {

        return {
            serialize: function(cat) {
                return JSON.stringify(cat);
            }
        };
    }
);