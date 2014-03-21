/**
 * Created by Michael on 13/03/14.
 */

describe('datastore service', function() {

    var datastore;
    var $httpBackend;
    var mockApiUrl =  'http://www.mydomain.com/api/';
    var mockThumbnailsUrl =  'http://www.mydomain.com/api/thumbnails';

    beforeEach( module( 'drawACat' ) );
    beforeEach( module( 'drawACat.common.services' ) );

    beforeEach( function() {
        var mockCONFIG  = {
            API_URL: mockApiUrl,
            THUMBNAILS_URL: mockThumbnailsUrl
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

    describe('listCats() method', function() {

        var response;

        beforeEach(function() {
            var mockResponse = [
                {
                    name: 'test cat',
                    created: '123456789',
                    thumbnail: 'thumb.png'
                }
            ];
            $httpBackend.whenGET(mockApiUrl + 'cat/').respond(200, angular.toJson(mockResponse));
            datastore.listCats().then(function(data) {
                response = data;
            });
        });

        it('should make correct api call on list', function() {
            $httpBackend.expectGET(mockApiUrl + 'cat/');
        });

        it('should transform the response timestamp with an extra 3 zeros', function() {
            expect(response.data[0].created).toEqual('123456789000');
        });

        it('should add the image path to the thumbnail', function() {
            expect(response.data[0].thumbnail).toEqual(mockThumbnailsUrl + 'thumb.png');
        });
    });



    describe('saveCat() method', function() {

        var postData;

        beforeEach(function() {
            postData = {
                name: 'bobby',
                description: 'a testing cat',
                author: 'Jim Test',
                isPublic: true,
                tags: 'tag1 tag2',
                cat: { catObject: 'mocked!' },
                thumbnail: 'wdawdawdawdawdawd'
            };
        });

        it('should make correct api call on save', function() {
            $httpBackend.expectPOST(mockApiUrl + 'cat/', postData).respond(201);
            datastore.saveCat(postData);
        });
    });


});