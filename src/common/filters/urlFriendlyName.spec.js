/**
 * Created by Michael on 21/03/14.
 */

describe('urlFriendlyName filter', function() {
    var urlFriendlyNameFilter;

    beforeEach(module('drawACat.common.filters'));
    beforeEach(inject(function(_$filter_) {
        urlFriendlyNameFilter = _$filter_('urlFriendlyName');
    }));

    it('should remove non-alphanumeric characters', function() {
        expect(urlFriendlyNameFilter('!"£$%^&*()?><#\'@')).toEqual('');
    });

    it('should convert spaces to hyphens', function() {
        expect(urlFriendlyNameFilter('name with  some spaces')).toEqual('name-with--some-spaces');
    });

    it('should make lowercase', function() {
        expect(urlFriendlyNameFilter('I Am a CAT!')).toEqual('i-am-a-cat');
    });
});