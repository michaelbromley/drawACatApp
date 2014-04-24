/**
 * Created by Michael on 08/03/14.
 */
angular.module('drawACat.common.services')

    .factory('datastore', function($http, CONFIG) {

        var apiUrl = CONFIG.API_URL;

        /**
         * Calculate a value for the trendingScore, for viewing cats by trending. It's a function of the rating and how long ago
         * it was created, with older cats getting penalized. Inspired by the Reddit algorithm: http://amix.dk/blog/post/19588
         * @param rating
         * @param created
         * @returns {number}
         */
        function getTrendingScore(rating, created) {
            var age = new Date().getTime() - created;
            var ageInDays = age / 86400000;

            return rating - ageInDays;
        }

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
                            cat.rating = parseInt(cat.rating, 10);
                            cat.trendingScore = getTrendingScore(cat.rating, cat.created);
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