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
            expect($state.href('draw')).toEqual('/cat/new');
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
        var datastore;
        var primitives;
        var drawHelper;
        var catBuilder;
        var serializer;
        var thumbnailGenerator;


        beforeEach(inject(function($rootScope, $controller, _primitives_, _drawHelper_, _serializer_, _datastore_, _catBuilder_, _thumbnailGenerator_) {
            scope = $rootScope.$new();

            datastore = _datastore_;
            primitives = _primitives_;
            drawHelper = _drawHelper_;
            serializer = _serializer_;
            thumbnailGenerator = _thumbnailGenerator_;
            catBuilder = _catBuilder_;

            // calls that should be made upon instantiation of the controller
            spyOn(drawHelper, "getCurrentPartKey").and.callThrough();
            spyOn(primitives, 'LineCollection').and.callThrough();

            drawController = $controller('DrawController', {
                $scope: scope,
                drawHelper: drawHelper,
                datastore: datastore,
                primitives: primitives
            });
        }));

        it('should call drawHelper.getCurrentPartKey()', function() {
            expect(drawHelper.getCurrentPartKey).toHaveBeenCalled();
        });

        it('should create a new LineCollection', function() {
            expect(primitives.LineCollection).toHaveBeenCalled();
        });

        it('should start with `completed` being false', function() {
            expect(scope.drawing.completed).toBe(false);
        });

        describe('nextStep() method', function() {

            var lineCollection;

            beforeEach(function() {
                var testLine = primitives.Line();
                testLine.addPoint([1,2]);
                scope.lineCollection.addLine(testLine);
                scope.currentStep = 'head';

                lineCollection = scope.lineCollection;

                scope.nextStep();
            });

            it('should add the new part to the cat', function() {
                expect(scope.catParts.head.lineCollection).toEqual(lineCollection);
            });

            it('should reset the lineCollection', function() {
                expect(scope.lineCollection.getPath()).toEqual([]);
            });

            it('should advance to the next step', function() {
                expect(drawHelper.getCurrentPartKey()).toEqual('eyesOpen');
            });
        });

        describe('saveCat() method', function() {

            var $state;

            beforeEach(inject(function(_$q_, _$state_) {
                $state = _$state_;

                spyOn(catBuilder, 'buildCatFromParts');
                spyOn(serializer, 'serializeCat');
                spyOn(thumbnailGenerator, 'getDataUri');
                spyOn($state, 'go');

                var deferred = _$q_.defer();
                deferred.resolve({
                    data: {id: 123}
                });
                spyOn(datastore, 'saveCat').and.callFake(function() {
                    return deferred.promise;
                });

                // populate a test catParts object
                var testLine = primitives.Line();
                testLine.addPoint([1,2]);
                var testLineCollection = primitives.LineCollection();
                testLineCollection.addLine(testLine);
                angular.forEach(scope.catParts, function(catPart) {
                    catPart.lineCollection = testLineCollection;
                });

                scope.saveCat({name: 'test'});
            }));

            it('should call the catBuilder', function() {
                expect(catBuilder.buildCatFromParts).toHaveBeenCalled();
            });

            it('should call the serializer', function() {
                expect(serializer.serializeCat).toHaveBeenCalled();
            });

            it('should call the thumbnailGenerator', function() {
                expect(thumbnailGenerator.getDataUri).toHaveBeenCalled();
            });

            it('should call the datastore.saveCat() method', function() {
                expect(datastore.saveCat).toHaveBeenCalled();
            });

            it('should redirect to created cat page on success', function() {
                scope.$apply();
                expect($state.go).toHaveBeenCalledWith('cat', { id: 123, name: 'test'});
            });
        });
    });
});