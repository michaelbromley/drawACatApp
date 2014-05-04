
angular.module( 'drawACat.home', [
        'drawACat.home.filters',
        'drawACat.home.tagSelector',
        'drawACat.home.previewPanel',
        'ui.router'
    ])


    .config(function config( $stateProvider ) {
        $stateProvider.state( 'home', {
            url: '/home',
            views: {
                "main": {
                    controller: 'HomeController',
                    templateUrl: 'home/home.tpl.html'
                }
            },
            data:{ pageTitle: 'Draw A Cat!' }
        });
    })

/**
 * And of course we define a controller for our route.
 */
    .controller( 'HomeController', function HomeController( $scope, $location, datastore ) {

        datastore.listCats().success(function(data) {
            $scope.cats = data;
        });

        $scope.tags = [];
        datastore.getTags().then(function(data) {
            $scope.tags = data.data;
        });

        $scope.searchInput = "";

        $scope.$watch(function() {
            return $location.search().tags;
        }, function(tags) {
            if (tags) {
                $scope.tagsArray = tags.split(' ');
            } else {
                $scope.tagsArray = [];
            }
        });
        $scope.predicate = "trendingScore";

        $scope.$watchCollection('tagsArray', function(tagsArray) {
            var search;
            if (0 < tagsArray.length) {
                search = tagsArray.join(' ');
            } else {
                search = null;
            }
            $location.search('tags', search);
        });

        $scope.tagLinkClicked = function(tag) {
            if ($scope.tagsArray.indexOf(tag) === -1) {
                $scope.tagsArray.push(tag);
            }
        };

        $scope.closeOverlay = function() {
            $scope.$broadcast('preview-click', true);
        };
    });