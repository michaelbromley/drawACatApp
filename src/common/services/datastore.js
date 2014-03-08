/**
 * Created by Michael on 08/03/14.
 */
angular.module('drawACat.common.services.datastore', [])

    .factory('datastore', function() {

        var cats = $mongolabResourceHttp('cats');

        return {
            save: function(cat) {
                cats.$save(cat)
            },
            load: function(cat) {

            }
        };
    }
);