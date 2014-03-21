/**
 * Created by Michael on 14/03/14.
 */
describe('catFactory service', function() {

    var cat;
    var testPart;
    var testPart2;

    beforeEach( module( 'drawACat' ) );
    beforeEach( module( 'drawACat.common.services' ) );

    beforeEach( inject( function( _catFactory_, _primitives_ ) {
        cat = _catFactory_.newCat();

        testPart = _primitives_.Part();
        testPart.createFromPath('test', [[[0, 0],[25, 20]]]);
        testPart2 = _primitives_.Part();
        testPart2.createFromPath('test', [[[10, 5],[10, 60]]]);
    }));

    it('should start as an empty cat', function() {
        expect(cat.bodyParts.head).toEqual({});
    });

    it('should return the correct path', function() {
        expect(cat.getPath()).toEqual([]);
        cat.bodyParts.head.part = testPart;
        expect(cat.getPath()).toEqual([
            [
                [0, 0],
                [25, 20]
            ]
        ]);
    });

    it('should return the correct height', function() {
        cat.bodyParts.head.part = testPart;
        cat.bodyParts.body.part = testPart2;
        expect(cat.getHeight()).toEqual(60);
    });

    it('should return the correct width', function() {
        cat.bodyParts.head.part = testPart;
        cat.bodyParts.body.part = testPart2;
        expect(cat.getWidth()).toEqual(25);
    });

    it('should adjust the position of the parts', function() {
        cat.bodyParts.head.part = testPart;
        expect(cat.bodyParts.head.part.getTransformationData().centreX).toEqual(12.5);
        expect(cat.bodyParts.head.part.getTransformationData().centreY).toEqual(10);

        cat.adjustPosition(30, 25);

        expect(cat.bodyParts.head.part.getTransformationData().centreX).toEqual(42.5);
        expect(cat.bodyParts.head.part.getTransformationData().centreY).toEqual(35);
    });

});