/**
 * Created by Michael on 21/03/14.
 */

angular.module('drawACat.common.directives')

    .directive('dacHashtagArea', function($compile) {

        /**
         * function taken from http://stackoverflow.com/a/263796/772859
         * @param el
         * @returns {*}
         */
        function getCaret(el) {
            if (el.selectionStart) {
                return el.selectionStart;
            } else if (document.selection) {
                el.focus();

                var r = document.selection.createRange();
                if (r == null) {
                    return 0;
                }

                var re = el.createTextRange(),
                    rc = re.duplicate();
                re.moveToBookmark(r.getBookmark());
                rc.setEndPoint('EndToStart', re);

                return rc.text.length;
            }
            return 0;
        }

        return {
            restrict: 'A',
            scope: {
                tags: '=dacHashtagArea'
            },
            link: function(scope, element, attrs) {

                function insertSelectedTag(selectedTag) {
                    var inputVal = input.val();
                    var output = inputVal.substring(0, scope.candidate.start) + '#' + selectedTag + inputVal.substring(scope.candidate.end);

                    scope.$parent.$apply(function() {
                        scope.$parent[attrs.ngModel] = output;
                        input.val(output);
                    });
                }

                // create the suggestions div
                var suggestions = angular.element(
                    '<div class="suggestions-container" ng-show="0 < filteredTags.length">' +
                        '<div class="suggestion" ng-class="{selected: $index == selectedIndex}" ng-repeat="tag in filteredTags = (tags | startsWith : candidateHashtag)">#{{ tag }}</div>' +
                        '</div>');
                suggestions.css({
                    'position': 'absolute',
                    'width': element[0].offsetWidth + 'px',
                    'left': element[0].offsetLeft + 'px',
                    'max-height': '200px',
                    'overflow': 'auto',
                    'z-index': 100
                });
                element.after(suggestions);
                $compile(suggestions)(scope);

                scope.candidateHashtag = "?";
                scope.candidate = {
                    start: 0,
                    end: 0
                };
                scope.selectedIndex = null;
                scope.filteredTags = [];

                var input = element;
                // ensure the element is a textarea
                if (input[0].nodeName !== 'TEXTAREA' && input[0].nodeName !== 'INPUT') {
                    return;
                }

                suggestions.on('click', function(e) {
                    var selectedTag = e.target.innerHTML.substring(1);
                    insertSelectedTag(selectedTag);
                    suggestions.addClass('ng-hide');
                });

                suggestions.on('mouseover', function() {
                    scope.$apply(function() {
                        scope.selectedIndex = null;
                    });
                });

                input.on('keyup', function() {
                    // is the caret inside a hashtag?
                    var candidateChanged = false;
                    var currentCaretIndex = getCaret(input[0]);
                    var text = input.val();
                    var regexp = /#[a-zA-Z0-9_]+/g;
                    var match;
                    while ((match = regexp.exec(text)) != null) {
                        var startOfHashtag = match.index;
                        var endOfHashtag = startOfHashtag + match[0].length;

                        if (startOfHashtag < currentCaretIndex && currentCaretIndex <= endOfHashtag) {
                            candidateChanged =  match[0].substring(1);
                            scope.candidate.start = startOfHashtag;
                            scope.candidate.end = endOfHashtag;
                        }
                    }
                    scope.$apply(function() {
                        scope.candidateHashtag = candidateChanged ? candidateChanged : "?";
                    });
                });

                input.on('keydown', function(e) {
                    var listLength = scope.filteredTags.length;
                    if (0 < listLength) {
                        var currentIndex;
                        var nextIndex = null;

                        if (e.keyCode === 40) {
                            // down arrow pressed
                            e.preventDefault();
                            currentIndex = scope.selectedIndex === null ? -1 : parseInt(scope.selectedIndex, 10);
                            nextIndex = currentIndex === listLength - 1 ? 0 : currentIndex + 1;
                        } else if (e.keyCode === 38) {
                            // up arrow pressed
                            e.preventDefault();
                            currentIndex = scope.selectedIndex === null ? 0 : parseInt(scope.selectedIndex, 10);
                            nextIndex = currentIndex === 0 ? listLength - 1 : currentIndex - 1;
                        } else if (e.keyCode === 13) {
                            // enter key pressed
                            e.preventDefault();
                            var selectedTag = scope.filteredTags[scope.selectedIndex];
                            insertSelectedTag(selectedTag);
                        }

                        scope.$apply(function() {
                            scope.selectedIndex = nextIndex;
                        });
                    }
                });
            }
        };
    });
