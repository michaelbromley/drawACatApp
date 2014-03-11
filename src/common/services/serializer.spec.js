
describe( 'serializer service', function() {

    var serializer;
    var catFactory;
    var behaviourFactory;
    var primitives;
    var testPath;
    var serializedCat;
    var testBehaviour;

    beforeEach( module( 'drawACat.common.services' ) );

    beforeEach( inject( function( _serializer_, _catFactory_, _behaviourFactory_, _primitives_ ) {
        serializer = _serializer_;
        catFactory = _catFactory_;
        behaviourFactory = _behaviourFactory_;
        primitives = _primitives_;

        testPath = [[[0,0],[1,1]]];
        testBehaviour = {
            "sensitivity": {
                "xOffset": 0,
                "yOffset": 0,
                "xSkew": 0.2,
                "ySkew": 0.2,
                "rotation": 0.1
            },
            "range": 100
        };
        serializedCat = {
                        head: {
                            part: {},
                            behaviour: {}
                        },
                        eyesOpen: {
                            part: {},
                            behaviour: {}
                        },
                        eyesClosed: {
                            part: {},
                            behaviour: {}
                        },
                        mouthOpen: {
                            part: {},
                            behaviour: {}
                        },
                        mouthClosed: {
                            part: {},
                            behaviour: {}
                        },
                        body: {
                            part: {},
                            behaviour: {}
                        },
                        leftLeg: {
                            part: {},
                            behaviour: {}
                        },
                        rightLeg: {
                            part: {},
                            behaviour: {}
                        }
                    };
    }));

    it( 'should be instantiated', inject( function() {
        expect( serializer ).toBeTruthy();
    }));

    describe('.serializeCat() method', function(){

        it('should serialize a simple cat object into a string', function() {
            var cat = catFactory.newCat();
            var output = serializer.serializeCat(cat);

            expect(output).toEqual(serializedCat);
        });

        it('should serialize a part contained in a bodyPart', function() {
            var cat = catFactory.newCat();
            var part = primitives.Part();
            part.createFromPath('testPart', testPath);
            cat.bodyParts.head.part = part;

            var output = serializer.serializeCat(cat);

            expect(output.head.part.path).toEqual(testPath);
            expect(output.head.part.name).toEqual('testPart');
        });

        it('should serialize a part\'s parent', function() {
            var cat = catFactory.newCat();
            var childPart = primitives.Part();
            var parentPart = primitives.Part();
            childPart.createFromPath('eyesOpen', testPath);
            parentPart.createFromPath('head', testPath);

            childPart.setParent(parentPart);

            cat.bodyParts.head.part = parentPart;
            cat.bodyParts.eyesOpen.part = childPart;

            var output = serializer.serializeCat(cat);

            expect(output.eyesOpen.part.parentName).toEqual('head');
        });

    });

    describe('.unserializeCat() method', function(){

        var serializedCatWithHeadAndEyes;

        beforeEach(function() {
            serializedCatWithHeadAndEyes = serializedCat;

            serializedCatWithHeadAndEyes.head.part.path = testPath;
            serializedCatWithHeadAndEyes.head.part.name = 'head';
            serializedCatWithHeadAndEyes.head.behaviour = testBehaviour;

            serializedCatWithHeadAndEyes.eyesOpen.part.path  = testPath;
            serializedCatWithHeadAndEyes.eyesOpen.part.name  = 'eyesOpen';
            serializedCatWithHeadAndEyes.eyesOpen.part.parentName  = 'head';
        });

        it('should create a new Cat object from a serialized cat JSON object', function() {

            var cat = serializer.unserializeCat(serializedCatWithHeadAndEyes);

            expect(typeof cat).toEqual('object');
            expect(cat.bodyParts).toBeDefined();
        });

        it('should correctly set the parent of a child part', function() {
            var cat = serializer.unserializeCat(serializedCatWithHeadAndEyes);
            expect(cat.bodyParts.eyesOpen.part.getParent().getName()).toEqual('head');
        });

        it('should correctly set the behaviour', function() {
            var cat = serializer.unserializeCat(serializedCatWithHeadAndEyes);
            expect(cat.bodyParts.head.behaviour.sensitivity).toEqual(testBehaviour.sensitivity);
            expect(cat.bodyParts.head.behaviour.range).toEqual(testBehaviour.range);
        });
    });

});

