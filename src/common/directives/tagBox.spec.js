/**
 * Created by Michael on 21/03/14.
 */


function __triggerKeyboardEvent(keyCode)
{
    var eventObj = document.createEventObject ?
        document.createEventObject() : document.createEvent("Events");

    if(eventObj.initEvent){
      eventObj.initEvent("keydown", true, true);
    }

    eventObj.keyCode = keyCode;
    eventObj.which = keyCode;

    //el.dispatchEvent ? el.dispatchEvent(eventObj) : el.fireEvent("onkeydown", eventObj);
    return eventObj;
}

describe('tagbox directive', function() {

    var textarea;
    var suggestions;
    var scope;

    beforeEach(module('drawACat.common.directives'));
    beforeEach(module('drawACat.common.filters'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        scope = _$rootScope_;

        scope.tags = [
            'cake',
            'cup',
            'hammer',
            'earth',
            'apple',
            'tap'
        ];

        textarea = angular.element('<textarea name="description" id="description" dac-tagbox="tags" rows="3"></textarea>');
        _$compile_(textarea)(scope);
        scope.$apply();

        suggestions = textarea.next();
        document.body.appendChild(textarea[0]);
    }));

    it('should add the suggestions div after the textarea', function() {
        expect(suggestions.hasClass('suggestions-container')).toBe(true);
    });

    it('suggestions should start off hidden', function() {
        expect(suggestions.hasClass('ng-hide')).toBe(true);
    });

    it('should show the suggestions when typing a hashtag that matches', function() {
        textarea.val('#c');
        textarea[0].selectionStart = 2;

        textarea.triggerHandler('keyup');
        scope.$apply();
        expect(suggestions.hasClass('ng-hide')).toBe(false);
    });

    it('should display the correct suggestions', function() {
        textarea.val('#c');
        textarea[0].selectionStart = 2;

        textarea.triggerHandler('keyup');
        scope.$apply();
        expect(suggestions.children()[0].innerHTML).toBe('#cake');
        expect(suggestions.children()[1].innerHTML).toBe('#cup');
    });

    it('should work when hashtag is in the middle of other text', function() {
        textarea.val('I want to eat some #ham and pickle');
        textarea[0].selectionStart = 23; // the end of the word "#ham"

        textarea.triggerHandler('keyup');
        scope.$apply();
        expect(suggestions.children()[0].innerHTML).toBe('#hammer');
    });

    describe('specifying the tag', function() {

    });

    xdescribe('keyboard events', function() {

        /**
         * Unfortunately unable to properly unit test keyboard events at the moment.
         * See http://stackoverflow.com/questions/22574431/testing-keydown-events-in-jasmine-with-specific-keycode
         */
        var suggestedTag1;
        var suggestedTag2;

        beforeEach(function() {
            textarea.val('#c');
            textarea[0].selectionStart = 2; // the end of the word "#ham"

            textarea.triggerHandler('keyup');
            scope.$apply();

            suggestedTag1 = angular.element(suggestions.children()[0]);
            suggestedTag2 = angular.element(suggestions.children()[1]);
        });

        it('should select suggestion on pressing down arrow', function() {
           // var event = new Event('keydown');
            //var event = new CustomEvent('keydown', { 'keyCode': 40 });
            //event.keyCode = 40;
            //var event = keyDownEvent(40);
            var event = document.createEvent("Events");
            event.initEvent("keydown", true, true);
            event.keyCode = 40;
           // var event =__triggerKeyboardEvent(40);
            textarea.triggerHandler("keydown", [40, 41]);
            scope.$apply();
            expect(suggestedTag1.hasClass('selected')).toBe('true');
        });

    });
});