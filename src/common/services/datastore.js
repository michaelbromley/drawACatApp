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
                return $http.get(apiUrl + 'cat/', {
                    transformResponse: function(data) {
                        var cats = angular.fromJson(data);
                        return cats.map(function(cat) {
                            cat.thumbnail = CONFIG.THUMBNAILS_URL + cat.thumbnail;
                            cat.created = cat.created + '000';
                            return cat;
                        });
                    }
                });
            },
            loadCat: function(id) {
                return $http.get(apiUrl + 'cat/' + id);
            },
            getTags: function() {
                return $http.get(apiUrl + 'tags/', { cache: true });
            },
            rateCat: function(id) {
                return $http.get(apiUrl + 'cat/' + id + '/rated');
            }
        };
    }
);