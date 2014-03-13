/**
 * Created by Michael on 13/03/14.
 */

describe('datastore service', function() {

    var datastore;
    var $httpBackend;
    var mockApiUrl =  'http://www.mydomain.com/api/';

    beforeEach( module( 'drawACat' ) );
    beforeEach( module( 'drawACat.common.services' ) );

    beforeEach( function() {
        var mockCONFIG  = {
            API_URL: mockApiUrl
        };
        module(function ($provide) {
            $provide.value('CONFIG', mockCONFIG);
        });

        inject( function( _$httpBackend_, _datastore_ ) {
            datastore = _datastore_;
            $httpBackend = _$httpBackend_;
        });
    });

    afterEach(inject(function($rootScope) {
        $rootScope.$apply();
        $httpBackend.flush();
    }));

    it('should make the correct api call on load', function() {
        $httpBackend.expectGET(mockApiUrl + 'cat/123').respond(200);
        datastore.loadCat(123);
    });

    it('should make correct api call on list', function() {
        $httpBackend.expectGET(mockApiUrl + 'cat/').respond(200);
        datastore.listCats();
    });

    it('should make correct api call on save', function() {
        var postData = {
            name: 'bobby',
            description: 'a testing cat',
            cat: { catObject: 'mocked!' }
        };

        $httpBackend.expectPOST(mockApiUrl + 'cat/', postData).respond(201);
        datastore.saveCat('bobby', 'a testing cat', { catObject: 'mocked!' });
    });

});