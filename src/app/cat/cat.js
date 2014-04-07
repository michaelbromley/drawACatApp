/**
 * Created by Michael on 10/03/14.
 */

angular.module( 'drawACat.cat', [
        'ui.router',
        'drawACat.cat.directives',
        'drawACat.cat.services'
    ])


    .config(function config( $stateProvider ) {
        $stateProvider.state( 'cat', {
            url: '/cat/{id:[0-9]+}/{name:[a-zA-Z0-9-]+}',
            views: {
                "main": {
                    controller: 'CatController',
                    templateUrl: 'cat/cat.tpl.html',
                    resolve: {
                        catPromise: function($stateParams, datastore) {
                            return datastore.loadCat($stateParams.id);
                        }
                    }
                }
            },
            data: { pageTitle: 'Cat' }
        });
    })

/**
 * And of course we define a controller for our route.
 */
    .controller( 'CatController', function CatController( $scope, $location, CONFIG, serializer, catPromise, Ball, emotion, ratingService, userOptions ) {
        // TODO: refactor all those dependencies above into helper services
        $scope.pageUrl = $location.absUrl();
        $scope.catData = catPromise.data;
        $scope.cat = serializer.unserializeCat(catPromise.data.data);
        $scope.cat.emotion = emotion;
        $scope.cat.emotion.start();
        $scope.ball = new Ball(25, CONFIG.BALL_IMAGE_SRC);
        $scope.renderQuality = userOptions.getRenderQuality();

        // emit an event to update the page metadata
        var metaData = {
            pageTitle: 'Come and play with ' + $scope.catData.name + '!',
            title: $scope.catData.name,
            url: $location.absUrl(),
            image: CONFIG.THUMBNAILS_URL + $scope.catData.thumbnail
        };
        $scope.$emit('metadata:updated', metaData);

        $scope.catHasBeenRated = ratingService.hasUserRatedThisCat($scope.catData.id);
        $scope.rateCat = function() {
            if (!$scope.catHasBeenRated) {
                ratingService.setCatAsRated($scope.catData.id);
                $scope.catHasBeenRated = true;
                var newRating;
                newRating = parseInt($scope.catData.rating, 10) + 1;
                $scope.catData.rating = newRating;
            }
        };

        $scope.setRenderQuality = function(value) {
           userOptions.setRenderQuality(parseInt(value, 10));
        };

        $scope.$on('$destroy', function() {
            emotion.reset();
        });
    })

;