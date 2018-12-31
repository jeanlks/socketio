const expect = require('expect');

const {isRealString} = require('./validation');


describe('isRealString', () => {
    it('should return false for non-string value', () => {
        var result = isRealString(82);
        expect(result).toBe(false);
    });

    it('should return true for string value', () => {
        var result = isRealString('test');
        expect(result).toBe(true);
    });

    it('should return true for string value with spaces', () => {
        var result = isRealString('test   test   ');
        expect(result).toBe(true);
    });

    it('should return false for string value with only spaces', () => {
        var result = isRealString('  ');
        expect(result).toBe(false);
    });
});
