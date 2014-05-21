/**
 * Created by Michael on 14/03/14.
 */

describe('index page', function() {

    it('should have the correct title', function() {
        browser.get('#');
        expect(browser.getTitle()).toEqual('Draw A Cat!');
    });
});