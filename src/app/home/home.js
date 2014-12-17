
angular.module( 'drawACat.home', [
        'drawACat.home.filters',
        'drawACat.home.tagSelector',
        'drawACat.home.previewPanel',
        'angularUtils.directives.dirPagination',
        'ui.router'
    ])


    .config(function config( $stateProvider  ) {
        $stateProvider.state( 'home', {
            url: '/home?page&sort&tags',
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
        $scope.tagsArray = $stateParams.tags ? $stateParams.tags.split(' ') : [];

        $scope.tags = [];
        datastore.getTags().then(function (data) {
            $scope.tags = data.data;
        });

        $scope.searchInput = "";


        $scope.$watchCollection('tagsArray', function(tagsArray) {
            $scope.setTags(tagsArray);
        });

        $scope.tagLinkClicked = function(tag) {
            if ($scope.tagsArray.indexOf(tag) === -1) {
                $scope.tagsArray.push(tag);
            }
        };

        $scope.pageChanged = function(pageNumber) {
            updateQueryString({ page: pageNumber });
        };

        $scope.sortBy = function(sort) {
            updateQueryString({ sort: sort });
        };

        $scope.setTags = function(tagsArray) {
            updateQueryString({tags: tagsArray.join(' ')});
        };

        $scope.closeOverlay = function() {
            $scope.$broadcast('preview-click', true);
        };

        getPage($scope.currentPage, $scope.sort, $scope.tagsArray);

        function updateQueryString(params) {
            var options = {};
            options.page = params.page || $scope.currentPage || null;
            options.sort = params.sort || $scope.sort || null;
            options.tags = params.tags || $scope.tagsArray.join(' ') || null;

            $state.transitionTo('home', options);
        }

        function getPage(pageNumber, sort, tagsArray) {
            datastore.listCats(pageNumber, sort, tagsArray).success(function(data) {
                $scope.cats = data.result;
                $scope.totalItems = data.totalCats;
                $scope.pageLower = ($scope.currentPage - 1) * 15 + 1;
                $scope.pageUpper = Math.min($scope.pageLower + 14, $scope.totalItems);
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