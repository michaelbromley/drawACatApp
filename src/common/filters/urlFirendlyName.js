/**
 * Created by Michael on 20/03/14.
 */
angular.module('drawACat.common.filters')

    .filter('urlFriendlyName', function() {
        return function(input) {

            var unicodeToPercentage = encodeURIComponent(input);
            var spacesToHyphens = unicodeToPercentage.replace(/%20/g, '-');
            var nonAlphaRemoved = spacesToHyphens.replace(/[^a-zA-Z0-9\-%\s]/g, '');
            return nonAlphaRemoved.toLowerCase();
        };
    });