/**
 * Created by Michael on 28/03/14.
 */

angular.module('drawACat.cat.services')

.factory('ratingService', function(ipCookie, datastore) {
        return {
            hasUserRatedThisCat: function(id) {
                var catsRated = angular.fromJson(ipCookie('rated')) || [];
                return (catsRated.indexOf(id) !== -1);
            },
            setCatAsRated: function(id) {
                var catsRated = angular.fromJson(ipCookie('rated')) || [];
                catsRated.push(id);
                ipCookie('rated', angular.toJson(catsRated), { expires: 365 } );
                datastore.rateCat(id);
            }
        };
    });