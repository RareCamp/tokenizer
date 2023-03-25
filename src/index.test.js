const index = require('./index');

test('return hello world', () => {
    expect(index()).toBe("Hello World");
})
