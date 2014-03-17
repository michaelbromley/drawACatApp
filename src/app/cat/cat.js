/**
 * Created by Michael on 10/03/14.
 */

angular.module( 'drawACat.cat', [
        'ui.state',
        'drawACat.cat.directives',
        'drawACat.cat.services'
    ])


    .config(function config( $stateProvider ) {
        $stateProvider.state( 'cat', {
            url: '/cat/{id:[0-9]+}',
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
            data:{ pageTitle: 'Cat' }
        });
    })

/**
 * And of course we define a controller for our route.
 */
    .controller( 'CatController', function CatController( $scope, CONFIG, catFactory, serializer, catPromise, ballFactory, emotion ) {
        $scope.cat = serializer.unserializeCat(catPromise.data.data);
        $scope.cat.name = catPromise.data.name;
        $scope.cat.emotion = emotion;
        $scope.ball = ballFactory.newBall(25, CONFIG.BALL_IMAGE_SRC);

        $scope.$on('$destroy', function() {
            emotion.cancelTimer();
        });
    })

;