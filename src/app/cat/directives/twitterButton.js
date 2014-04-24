/**
 * Created by Michael on 28/03/14.
 */
angular.module('drawACat.cat.directives')

    .directive('twitterButton', function($window, $location) {

        // load the Twitter button script
        // https://dev.twitter.com/docs/intents/events#events
        $window.twttr = (function (d,s,id) {
            var t, js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js=d.createElement(s);
            js.id=id;
            js.src="https://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js, fjs);
            return window.twttr || (t = { _e: [], ready: function(f){ t._e.push(f); } });
        }(document, "script", "twitter-wjs"));

        return {
            restrict: 'AE',
            link: function(scope, element) {

                var url = $location.absUrl();

                scope.$watch(function() {
                    return ($window.twttr.widgets !== undefined);
                }, function(isLoaded) {
                    if (isLoaded) {
                        $window.twttr.widgets.createShareButton(
                            url,
                            element[0],
                            function (el) {
                                console.log("Button created.");
                            },
                            {
                                count: 'horizontal',
                                hashtags: 'drawacat'
                            }
                        );
                    }
                });

            }
        };
    });