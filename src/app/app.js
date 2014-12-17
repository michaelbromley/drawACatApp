angular.module( 'drawACat', [
        'templates-app',
        'templates-common',
        'ui.router',
        'drawACat.home',
        'drawACat.cat',
        'drawACat.draw',
        'drawACat.common.services',
        'drawACat.common.directives',
        'drawACat.common.filters',
        'ngAnimate'
    ])

    .value('CONFIG', {
        API_URL: '%API_PATH%',
        THUMBNAILS_URL: '%THUMBNAILS_PATH%',
        AUDIO_FILES_URL: 'assets/audio/',
        FILL_COLOUR: '#f5f5f5',
        STROKE_COLOUR: '#333333'
    })

    .config( function myAppConfig ( $stateProvider, $urlRouterProvider, $locationProvider ) {
        $locationProvider.html5Mode(true).hashPrefix('!');
        $urlRouterProvider.otherwise( 'home' );
    })

    .run( function run (rafPolyfill) {
        rafPolyfill.run();// polyfill the $window.requestAnimationFrame, cancelAnimationFrame methods
    })

    .controller( 'AppController', function AppController ( $scope, $timeout, $window, $state, $location, $anchorScroll ) {
        $scope.embed = $location.search().embed;

        $scope.$on('$stateChangeSuccess', function(event, toState){
            if ( angular.isDefined( toState.data.pageTitle ) ) {
                $scope.pageTitle = toState.data.pageTitle ;
            }
            $anchorScroll();
            if ($state.current.name === 'draw') {
                $scope.isDrawState = true;
            } else {
                $scope.isDrawState = false;
            }
        });

        $scope.$on('metadata:updated', function(event, metaData) {
            $scope.metaData = metaData;
            $timeout(function () {
                // push event to google analytics. This is done in a $timeout
                // so the current $digest loop has a chance to actually update the
                // HTML with the correct page title etc.
                $window.ga('send', 'pageview', { page: $location.path() });
            });
        });

        $scope.scrollTo = function(id) {
            var old = $location.hash();
            $location.hash(id);
            $anchorScroll();
            //reset to old to keep any additional routing logic from kicking in
            $location.hash(old);
        };
    })

;

