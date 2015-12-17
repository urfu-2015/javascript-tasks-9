var assert = require('assert');

// Ваша супер библиотека
var flow = require('../lib/flow.js');

describe('Check', function () {
    it('should check that target parallel one error', function (done) {
        var result = [];


        function test2(callback) {
            setTimeout(function () {
                callback(true, 1);
            }, 0);
        }

        function test1(callback) {
            setTimeout(function () {
                callback(true, 1);
            }, 0);
        }

        var test_function = [test1, test2];

        flow.parallel(test_function, function (error, data) {
            result.push(error);
            assert.equal(result.length, 1);
            done();
        });


    });

    it('should check that target parallel', function (done) {
        var result = [];

        function callback(error, data) {
            result = data;
            assert.deepEqual(result.sort(), [1,2].sort());
            done();
        }

        function test2(callback) {
            setTimeout(function () {
                callback(false, 1);
            }, 0);

        }

        function test1(callback) {
            setTimeout(function () {
                callback(false, 2);
            }, 0);
        }

        var test_function = [test1, test2];
        flow.parallel(test_function, callback);

    });

    it('should check that target emptyArray in parallel', function (done) {
        var result = [];

        function callback(error, data) {
            assert.deepEqual(error, null);
            done();
        }

        var test_function = [];
        flow.parallel(test_function, callback);
    });

    it('should check that target emptyArray in serial', function (done) {
        var result = [];

        function callback(error, data) {
            assert.deepEqual(error, null);
            done();
        }

        var test_function = [];
        flow.serial(test_function, callback);
    });

    it('should check that target emptyArray in map', function (done) {
        var result = [];

        function callback(error, data) {
            assert.deepEqual(error, null);
            done();
        }

        function test2(callback) {
            setTimeout(function () {
                callback(false, 1);
            }, 0);

        }

        function test1(callback) {
            setTimeout(function () {
                callback(false, 2);
            }, 0);
        }

        var test_function = [test1, test2];
        flow.map([], test_function, callback);
    });
});
