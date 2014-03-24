/**
 * Created by Michael on 24/03/14.
 */

describe('byTag filter', function() {
    var byTagFilter;
    var catListArray;

    beforeEach(module('drawACat.home.filters'));
    beforeEach(inject(function(_$filter_) {
        catListArray = [
            {
                name: 'cat1',
                tags: []
            },
            {
                name: 'cat2',
                tags: ['tag1']
            },
            {
                name: 'cat3',
                tags: ['tag1', 'tag2']
            },
            {
                name: 'cat4',
                tags: ['tag2', 'tag3', 'tag4']
            }
        ];
        byTagFilter = _$filter_('byTag');
    }));

    it('should return full input array if empty search array', function() {
        expect(byTagFilter(catListArray, [])).toEqual(catListArray);
    });

    it('should filter correctly with single tag', function() {
        var expectedResult = [
            {
                name: 'cat2',
                tags: ['tag1']
            },
            {
                name: 'cat3',
                tags: ['tag1', 'tag2']
            }
        ];

        expect(byTagFilter(catListArray, ['tag1'])).toEqual(expectedResult);
    });

    it('should filter correctly with multiple tags', function() {
        var expectedResult = [
            {
                name: 'cat3',
                tags: ['tag1', 'tag2']
            }
        ];

        expect(byTagFilter(catListArray, ['tag1', 'tag2'])).toEqual(expectedResult);
    });

    it('should filter correctly with multiple non-consecutive tags', function() {
        var expectedResult = [
            {
                name: 'cat4',
                tags: ['tag2', 'tag3', 'tag4']
            }
        ];

        expect(byTagFilter(catListArray, ['tag2', 'tag4'])).toEqual(expectedResult);
    });



});