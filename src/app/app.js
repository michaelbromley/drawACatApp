angular.module( 'drawACat', [
        'templates-app',
        'templates-common',
        'ui.state',
        'ui.route',
        'drawACat.home',
        'drawACat.cat',
        'drawACat.draw',
        'drawACat.common.services'
    ])

    .value('CONFIG', {
        API_URL: 'http://localhost/GitHub/drawACatApp/api/'
    })

    .config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
        $urlRouterProvider.otherwise( '/home' );
    })

    .run( function run (rafPolyfill) {
        rafPolyfill.run();// polyfill the $window.requestAnimationFrame, cancelAnimationFrame methods
    })

    .controller( 'AppController', function AppController ( $scope, $location ) {
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if ( angular.isDefined( toState.data.pageTitle ) ) {
                $scope.pageTitle = toState.data.pageTitle ;
            }
        });
    })

;

