/**
 * Created by Michael on 17/03/14.
 */



describe('draw page', function() {

    beforeEach(module('drawACat'));

    describe('draw route', function() {

        var $rootScope;
        var $state;

        beforeEach(function() {
            inject(function(_$rootScope_, _$state_) {
                $rootScope = _$rootScope_;
                $state = _$state_;
            });
        });

        it('should route to the correct URL', function() {
            expect($state.href('draw')).toEqual('#/cat/new');
        });

        it('should load the DrawController', function() {
            $state.go('draw');
            $rootScope.$digest();
            expect($state.current.views.main.controller).toEqual('DrawController');
        });
    });

    describe('DrawController', function() {


        var scope;
        var drawController;
        var catFactory;
        var datastore;
        var primitives;
        var drawHelper;
        var catNormalizer;
        var serializer;


        beforeEach(inject(function($rootScope, $controller, _catFactory_, _datastore_, _primitives_, _drawHelper_, _catNormalizer_, _serializer_) {
            scope = $rootScope.$new();

            catFactory = _catFactory_;
            datastore = _datastore_;
            primitives = _primitives_;
            drawHelper = _drawHelper_;
            catNormalizer = _catNormalizer_;
            serializer = _serializer_;

            // calls that should be made upon instantiation of the controller
            spyOn(catFactory, "newCat").and.callThrough();
            spyOn(primitives, 'LineCollection').and.callThrough();

            drawController = $controller('DrawController', {
                $scope: scope,
                catFactory: catFactory,
                datastore: datastore,
                primitives: primitives
            });
        }));

        it('should initialize the cat', function() {
            expect(catFactory.newCat).toHaveBeenCalled();
        });

        it('should create a new LineCollection', function() {
            expect(primitives.LineCollection).toHaveBeenCalled();
        });

        it('should start with `completed` being false', function() {
            expect(scope.completed).toBe(false);
        });

        describe('addNewPart() method', function() {

            beforeEach(function() {
                spyOn(drawHelper, 'getCurrentPartKey').and.returnValue('head');
                spyOn(drawHelper, 'next');

                var testLine = primitives.Line();
                testLine.addPoint([1,2]);
                scope.lineCollection.addLine(testLine);

                scope.addNewPart();
            });

            it('should get the part key from the drawHelper', function() {
                expect(drawHelper.getCurrentPartKey).toHaveBeenCalled();
            });

            it('should add the new part to the cat', function() {
                expect(scope.cat.bodyParts.head.part).toBeDefined();
            });

            it('should reset the lineCollection', function() {
                expect(scope.lineCollection.getPath()).toEqual([]);
            });

            it('should move the drawHelper on to the next part', function() {
                expect(drawHelper.next).toHaveBeenCalled();
            });
        });

        describe('saveCat() method', function() {

            beforeEach(function() {
               spyOn(catNormalizer, 'normalize');
               spyOn(serializer, 'serializeCat');
               spyOn(datastore, 'saveCat');

               scope.saveCat();
            });

            it('should call the normalizer', function() {
                expect(catNormalizer.normalize).toHaveBeenCalled();
            });

            it('should call the serializer', function() {
                expect(serializer.serializeCat).toHaveBeenCalled();
            });

            it('should call the normalizer', function() {
                expect(datastore.saveCat).toHaveBeenCalled();
            });


        });
    });
});