angular.module( 'drawACat', [
        'templates-app',
        'templates-common',
        'ui.state',
        'ui.route',
        'drawACat.draw',
        'drawACat.common.services.primitives',
        'drawACat.common.services.renderer',
        'drawACat.common.services.catFactory',
        'drawACat.common.services.behaviourFactory',
        'drawACat.common.services.serializer',
        'drawACat.common.services.datastore'
    ])

    .config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
        $urlRouterProvider.otherwise( '/cat/new' );
    })

    .run( function run () {
    })

    .controller( 'AppController', function AppController ( $scope, $location ) {
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if ( angular.isDefined( toState.data.pageTitle ) ) {
                $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
            }
        });
    })

;

