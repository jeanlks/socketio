var expect = require('expect');
var {generateMessage} = require('./message')

describe('generateMessage', () => {
    it('should generate message object', () => {
        var from = 'test';
        var text = 'test';
        var message = generateMessage(from,text);
        
        expect(message.text).toBe(from);
        expect(message.from).toBe(text);
    })
})