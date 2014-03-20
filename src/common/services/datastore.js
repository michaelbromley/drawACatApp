/**
 * Created by Michael on 08/03/14.
 */
angular.module('drawACat.common.services')

    .factory('datastore', function($http, CONFIG) {

        var apiUrl = CONFIG.API_URL;

        return {
            saveCat: function(catInfo) {
                return $http.post(apiUrl + 'cat/', {
                    name: catInfo.name,
                    description: catInfo.description,
                    author: catInfo.author,
                    isPublic: catInfo.isPublic,
                    tags: catInfo.tags,
                    thumbnail: catInfo.thumbnail,
                    cat: catInfo.cat
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