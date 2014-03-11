/**
 * Created by Michael on 08/03/14.
 */
angular.module('drawACat.common.services')

    .factory('datastore', function($http, CONFIG) {

        var apiUrl = CONFIG.API_URL;

        return {
            saveCat: function(name, description, cat) {
                return $http.post(apiUrl + 'cat/', {
                    name: name,
                    description: description,
                    cat: cat
                });
            },
            listCats: function() {
                return $http.get(apiUrl + 'cat/');
            },
            loadCat: function(id) {
                return $http.get(apiUrl + 'cat/' + id);
            }
        };
    }
);