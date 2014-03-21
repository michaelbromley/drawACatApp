/**
 * Created by Michael on 20/03/14.
 */
angular.module('drawACat.common.filters')

    .filter('urlFriendlyName', function() {
        return function(input) {
            var nonAlphaRemoved = input.replace(/[^a-zA-Z0-9_\s]/g, '');
            var spacesToHyphens = nonAlphaRemoved.replace(/\s/g, '-');
            return spacesToHyphens.toLowerCase();
        };
    });