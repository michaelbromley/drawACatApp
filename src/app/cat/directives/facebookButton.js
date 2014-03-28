/**
 * Created by Michael on 28/03/14.
 */
angular.module('drawACat.cat.directives')

    .directive('facebookButton', function($location, $window) {

        /*// load the Facebook script per https://developers.facebook.com/docs/plugins/share-button/
        var fbRoot = angular.element('<div id="fb-root"></div>');
        angular.element(document.body).prepend(fbRoot);
        (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {return;}
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/en_GB/all.js#xfbml=1";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        return {
            restrict: 'A',
            link: function(scope, element) {

                var url = $location.absUrl();

                var shareButton = angular.element('<div class="fb-share-button" data-href="' + url + '" data-type="button_count"></div>');
                element.append(shareButton);

            }
        };*/

        return {
            restrict: 'A',
            link: function(scope, element) {
                var url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent($location.absUrl());
                element.on('click', function() {
                    scope.$apply(function() {
                        scope.url = url;
                        var fbWindow = $window.open(url,'name','height=322,width=500');
                        if ($window.focus) {
                            fbWindow.focus();
                        }
                    });
                });
            }
        };
    });