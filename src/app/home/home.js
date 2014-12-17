
angular.module( 'drawACat.home', [
        'drawACat.home.filters',
        'drawACat.home.tagSelector',
        'drawACat.home.previewPanel',
        'angularUtils.directives.dirPagination',
        'ui.router'
    ])


    .config(function config( $stateProvider  ) {
        $stateProvider.state( 'home', {
            url: '/home?page&sort',
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
    .controller( 'HomeController', function HomeController( $scope, $location, $state, $stateParams, datastore ) {

        // emit an event to update the page metadata
        var metaData = {
            pageTitle: 'Draw A Cat!',
            title: 'Draw A Cat!',
            url: $location.absUrl(),
            image: 'assets/cat-big.gif'
        };
        $scope.$emit('metadata:updated', metaData);

        $scope.sort = $stateParams.sort || "top";
        $scope.currentPage = $stateParams.page || 1;

        getPage($scope.currentPage, $scope.sort);

        $scope.tags = [];
        datastore.getTags().then(function (data) {
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

        $scope.pageChanged = function(pageNumber) {
            $state.transitionTo('home', {
                page: pageNumber,
                sort: $scope.sort
            } );
        };

        $scope.sortBy = function(sort) {
            $state.transitionTo('home', {
                page: $scope.currentPage,
                sort: sort
            } );
        };

        $scope.closeOverlay = function() {
            $scope.$broadcast('preview-click', true);
        };


        function getPage(pageNumber, sort) {
            datastore.listCats(pageNumber, sort).success(function(data) {
                $scope.cats = data.result;
                $scope.totalItems = data.totalCats;
            });
        }
    })

    .filter('startFrom', function() {
        return function(input, start) {
            if (typeof input !== 'undefined' && 0 < input.length) {
                start = +start; //parse to int
                return input.slice(start);
            }
        };
    });