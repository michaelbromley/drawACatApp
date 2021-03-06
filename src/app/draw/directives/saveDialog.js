/**
 * Created by Michael on 20/03/14.
 */
angular.module('drawACat.draw.directives')

.directive('dacSaveDialog', function(datastore) {

        function getTagsFromDescription(description) {
            var regexp = /#([a-zA-Z0-9_]+)/g;
            var tags = [];
            var match;
            while (match = regexp.exec(description)) {
                if (tags.indexOf(match[1].toLowerCase()) === -1) {
                    tags.push(match[1].toLowerCase());
                }
            }
            return tags;
        }

        return {
            restrict: 'E',
            templateUrl: 'draw/directives/saveDialog.tpl.html',
            scope: {
                show: '=',
                submit: '&'
            },
            link: function(scope) {
                scope.isPublic = true;
                scope.buttonText = "Save Cat";

                scope.hashTags = [];
                datastore.getTags().then(function(data) {
                    scope.hashTags = data.data;
                });

                scope.hideModal = function() {
                    scope.show = false;
                };

                scope.submitForm = function() {
                    scope.buttonText = "Saving...";
                    scope.submit({formData: {
                        name: scope.name,
                        description: scope.description,
                        author: scope.author,
                        isPublic: scope.isPublic,
                        tags: getTagsFromDescription(scope.description)
                    }});
                };
            }
        };
    });