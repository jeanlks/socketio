var expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message')

describe('generateMessage', () => {
    it('should generate message object', () => {
        var from = 'test';
        var text = 'test';
        var message = generateMessage(from,text);
        
        expect(message.text).toBe(from);
        expect(message.from).toBe(text);
    });
});

describe('generateLocationMessage', () => {
    it('should generate location object', () => {
        var from  = 'location';
        var latitude = '-14.6962419';
        var longitude = '-48.248675999999996';

        var locationObject = generateLocationMessage(from, latitude, longitude);
        expect(locationObject.url).toBe('https://www.google.com/maps?q=-14.6962419,-48.248675999999996')
    });
});