/**
 * Created by Michael on 12/04/14.
 */

angular.module('drawACat.home.tagSelector', [])

    .directive('tagSelector', function() {
        return {
            restrict: 'E',
            templateUrl: 'home/directives/tagSelector.tpl.html',
            link: function(scope, element, attrs) {
                scope.keyHandler = function(e) {
                    if (e.keyCode === 13) {
                        addTag();
                    }
                };
                scope.removeTag = function(index) {
                    scope.tagsArray.splice(index, 1);
                };
                scope.tagSelectedHandler = function() {
                    addTag();
                };

                function addTag() {
                    if (scope.tagsArray.indexOf(scope.tagsInput) === -1) {
                        scope.tagsArray.push(scope.tagsInput);
                    }
                    scope.tagsInput = '';
                }
            }
        };
    })
;