var assert = require('assert');

// Ваша супер библиотека
var flow = require('../lib/flow.js');


describe('Check', function () {
    it('should check that target parallel one error', function () {
        var result = [];

        function callback(error, data) {
            result.push(error);
        }

        function test2(callback) {
            callback(true, 1);
        }

        function test1(callback) {
            callback(true, 1);
        }

        var test_function = [test1, test2];
        flow.parallel(test_function, callback);
        assert.equal(result.length, 1);
    });

    it('should check that target parallel', function () {
        var result = [];

        function callback(error, data) {
            result = data;
        }

        function test2(callback) {
            callback(false, 2);
        }

        function test1(callback) {
            callback(false, 1);
        }

        var test_function = [test1, test2];
        flow.parallel(test_function, callback);
        assert.deepEqual(result, [1, 2]);
    });
});
