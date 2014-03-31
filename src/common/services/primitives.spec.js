/**
 * Created by Michael on 13/03/14.
 */
describe( 'primitives service', function() {

    var primitives;

    beforeEach( module( 'drawACat.common.services' ) );

    beforeEach( inject( function( _primitives_ ) {
        primitives = _primitives_;
    }));

    describe('Line object', function() {

        var line;

        beforeEach(function() {
            line = primitives.Line();
        });

        it('should start with an empty path', function() {
            expect(line.getPath()).toEqual([]);
        });

        it('should add a point', function() {
            line.addPoint(10, 15);
            expect(line.getPath()).toEqual([[10, 15]]);
        });
    });

    describe('LineCollection object', function() {
        var lineCollection;
        var testLine;

        beforeEach(function() {
            lineCollection = primitives.LineCollection();
            testLine = primitives.Line();
            testLine.addPoint(1, 5);
            testLine.addPoint(3, 10);
            testLine.addPoint(7, 15);
        });

        it('should start with an empty collection', function() {
            expect(lineCollection.getPath()).toEqual([]);
        });

        it('should add a line', function() {
            lineCollection.addLine(testLine);
            expect(lineCollection.count()).toEqual(1);
        });

        it('should remove a line', function() {
            lineCollection.addLine(testLine);
            expect(lineCollection.count()).toEqual(1);
            lineCollection.removeLine();
            expect(lineCollection.count()).toEqual(0);
        });

        it('should return the path', function() {
            lineCollection.addLine(testLine);
            lineCollection.addLine(testLine);

            var expectedResult = [
                [
                    [1,5],
                    [3,10],
                    [7,15]
                ],
                [
                    [1,5],
                    [3,10],
                    [7,15]
                ]
            ];

            expect(lineCollection.getPath()).toEqual(expectedResult);
        });
    });

    describe('Part object', function() {
        var part;
        var testPath;

        beforeEach(function() {
            part = primitives.Part();
            testPath = [
                [
                    [1,5],
                    [3,10],
                    [7,15]
                ],
                [
                    [1,5],
                    [3,10],
                    [7,15]
                ]
            ];
        });

        it('should start with an empty path', function() {
            expect(part.getPath()).toEqual([]);
        });

        it('should populate via the createFromPath() method', function() {
            part.createFromPath('testPart', testPath);
            expect(part.getPath()).toEqual(testPath);
            expect(part.getName()).toEqual('testPart');
        });

        it('should handle bad input in createFromPath() method', function() {
            part.createFromPath({ notAString: true }, 'notAnArray');
            expect(part.getPath()).toEqual([]);
            expect(part.getName()).toEqual('');
        });

        it('should set its parent correctly', function() {
            var parentPart = primitives.Part();
            parentPart.createFromPath('parentPart', []);

            expect(part.getParent()).toBeNull();

            part.setParent(parentPart);
            expect(part.getParent().getName()).toEqual('parentPart');
        });

        it('should have settable transformation properties', function() {
            part.setXOffset(12);
            part.setYOffset(13);
            part.setXSkew(10);
            part.setYSkew(11);
            part.setRotation(14);

            var expectedResult = {
                xOffset: 12,
                yOffset: 13,
                pivotPointX: 0,
                pivotPointY: 0,
                rotation: 14,
                xSkew: 10,
                ySkew: 11,
                width: 0,
                height: 0,
                centreX: 0,
                centreY: 0,
                scale: 1
            };
            expect(part.getTransformationData()).toEqual(expectedResult);
        });

        it('should correctly calculate part dimensions', function() {
            var path = [
                [
                    [0, 0],
                    [25, 20]
                ]
            ];
            part.createFromPath('test', path);

            expect(part.getTransformationData().width).toEqual(25);
            expect(part.getTransformationData().height).toEqual(20);
        });
    });
});