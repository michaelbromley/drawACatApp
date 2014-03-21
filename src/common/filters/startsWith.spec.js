/**
 * Created by Michael on 21/03/14.
 */

describe('startsWith filter', function() {
    var startsWithFilter;
    var testArray;

    beforeEach(module('drawACat.common.filters'));
    beforeEach(inject(function(_$filter_) {
        testArray = [
            'cake',
            'hammer',
            'cup',
            'earth',
            'apple',
            'tap'
        ];
        startsWithFilter = _$filter_('startsWith');
    }));

    it('should should return just the items starting with the search string', function() {
        expect(startsWithFilter(testArray, 'c')).toEqual(['cake', 'cup']);
    });

    it('should not return items if the search appears mid way through the string', function() {
        expect(startsWithFilter(testArray, 'a')).toEqual(['apple']);
    });

});