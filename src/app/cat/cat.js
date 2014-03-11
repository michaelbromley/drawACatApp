/**
 * Created by Michael on 10/03/14.
 */

angular.module( 'drawACat.cat', [
        'ui.state',
        'drawACat.cat.stage',
        'drawACat.cat.transformer'
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
    .controller( 'CatController', function CatController( $scope, catFactory, serializer, catPromise ) {
        $scope.catName = catPromise.data.name;

        $scope.cat = serializer.unserializeCat(catPromise.data.data);
    })

;