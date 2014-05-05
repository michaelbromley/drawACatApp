
angular.module( 'drawACat.home', [
        'drawACat.home.filters',
        'drawACat.home.tagSelector',
        'drawACat.home.previewPanel',
        'drawACat.home.pagination',
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
    .controller( 'HomeController', function HomeController( $scope, $location, $filter, datastore ) {

        datastore.listCats().success(function(data) {
            $scope.cats = data;
            $scope.filteredCats = data;
        });

        $scope.currentPage = 1;
        $scope.itemsPerPage = 20;
        $scope.numberOfPages = 0;

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
            $scope.filteredCats = $filter('byTag')($scope.cats, tagsArray);
        });

        $scope.$watch('filteredCats.length', function(val) {
            $scope.numberOfPages =  Math.ceil(val / $scope.itemsPerPage);
        });

        $scope.tagLinkClicked = function(tag) {
            if ($scope.tagsArray.indexOf(tag) === -1) {
                $scope.tagsArray.push(tag);
            }
        };

        $scope.closeOverlay = function() {
            $scope.$broadcast('preview-click', true);
        };
    })

    .filter('startFrom', function() {
        return function(input, start) {
            if (typeof input !== 'undefined' && 0 < input.length) {
                start = +start; //parse to int
                return input.slice(start);
            }
        };
    });