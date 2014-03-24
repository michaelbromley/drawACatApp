/**
 * Created by Michael on 24/03/14.
 */
angular.module('drawACat.home.filters')

.filter('byTag', function() {
        return function(catListArray, tagArray) {
            if (tagArray.length === 0) {
                return catListArray;
            }

            var matches = [];
            for(var i = 0; i < catListArray.length; i++) {
                var catObj = catListArray[i];

                var containsAllTags = (0 < catObj.tags.length);
                for(var j = 0; j < tagArray.length; j++) {
                    if (catObj.tags.indexOf(tagArray[j]) === -1) {
                        containsAllTags = false;
                    }
                }

                if (containsAllTags) {
                    matches.push(catObj);
                }
            }
            return matches;
        };
    });