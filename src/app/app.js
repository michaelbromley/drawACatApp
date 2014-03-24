angular.module( 'drawACat', [
        'templates-app',
        'templates-common',
        'ui.router',
        'drawACat.home',
        'drawACat.cat',
        'drawACat.draw',
        'drawACat.common.services',
        'drawACat.common.directives',
        'drawACat.common.filters'
    ])

    .value('CONFIG', {
        API_URL: 'http://192.168.0.10/GitHub/drawACatApp/api/',
        THUMBNAILS_URL: 'http://192.168.0.10/GitHub/drawACatApp/api/thumbnails/',
        BALL_IMAGE_SRC: 'assets/images/ball01.gif',
        FILL_COLOUR: '#efefef',
        STROKE_COLOUR: '#333333'
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

