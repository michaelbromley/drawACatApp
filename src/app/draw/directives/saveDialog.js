/**
 * Created by Michael on 20/03/14.
 */
angular.module('drawACat.draw.directives')

.directive('dacSaveDialog', function() {

        function getTagsFromDescription(description) {

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

                scope.hashTags = [
                    'cake',
                    'hammer',
                    'earth',
                    'apple',
                    'tap'
                ];

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
                        tags: scope.tags
                    }});
                };
            }
        };
    });