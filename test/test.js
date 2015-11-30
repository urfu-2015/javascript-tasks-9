var assert = require('assert');
var fs = require('fs');

var test = require('../lib/flow');

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

chai.use(require('sinon-chai'));

var serial = test.serial;

describe('Котофайлы', function () {
    describe('serial', function () {
        it('Должен вызывать единственную функцию без аргументов', function () {
            var func = sinon.spy(function (next) {
                next(null, 1);
            });
            var callback = sinon.spy();

            test.serial([func], callback);

            sinon.assert.calledOnce(func);
            sinon.assert.calledOnce(callback);
            assert(callback.calledWith(null, 1));
        });

        it('Должен объединять две функции в цепочку', function () {
            var func1 = sinon.spy(function (next) {
                next(null, 1);
            });
            var func2 = sinon.spy(function (data, next) {
                next(null, 2);
            });
            var callback = sinon.spy();

            test.serial([func1, func2], callback);

            sinon.assert.calledOnce(func1);
            sinon.assert.calledOnce(func2);
            sinon.assert.calledOnce(callback);
            assert(callback.calledWith(null, 2));
            assert.equal(1, func2.getCall(0).args[0]);
        });

        it('Не выполняется вторая функция, если первая вызвала ошибку', function () {
            var func1 = sinon.spy(function (next) {
                next('error');
            });
            var func2 = sinon.spy(function (data, next) {
                next(null, 2);
            });
            var callback = sinon.spy();

            test.serial([func1, func2], callback);

            sinon.assert.calledOnce(func1);
            sinon.assert.notCalled(func2);
            sinon.assert.calledOnce(callback);
            assert(callback.calledWith('error'));
        });
    });
    describe('parallel', function () {
        it('Должен вызывать единственную функцию', function () {
            var func = sinon.spy(function (next) {
                next(null, 1);
            });
            var callback = sinon.spy();

            test.parallel([func], callback);

            sinon.assert.calledOnce(func);
            sinon.assert.calledOnce(callback);
            assert(callback.calledWith(null, [1]));
        });
        it('Должен вызывать все три функции', function () {
            var func1 = sinon.spy(function (next) {
                next(null, 1);
            });
            var func2 = sinon.spy(function (next) {
                next(null, 2);
            });
            var func3 = sinon.spy(function (next) {
                next(null, 3);
            });
            var callback = sinon.spy();

            test.parallel([func1, func2, func3], callback);

            sinon.assert.calledOnce(func1);
            sinon.assert.calledOnce(func2);
            sinon.assert.calledOnce(func3);
            sinon.assert.calledOnce(callback);
            assert(callback.calledWith(null, [1, 2, 3]));
        });
        it('Должен вызывать все три функции по порядку, т.к. задано ограничение в 1',
            function (done) {

                var func1 = sinon.spy(function (next) {
                    fs.readFile('./cats/barsik.json', function () {
                        sinon.assert.notCalled(func2);
                        sinon.assert.notCalled(func3);
                        next(arguments);
                    });
                });
                var func2 = sinon.spy(function (next) {
                    fs.readFile('./cats/batonchik.json', function () {
                        sinon.assert.calledOnce(func1);
                        sinon.assert.notCalled(func3);
                        next(arguments);
                    });
                });
                var func3 = sinon.spy(function (next) {
                    fs.readFile('./cats/murzic.json', function () {
                        sinon.assert.calledOnce(func1);
                        sinon.assert.calledOnce(func2);
                        next(arguments);
                    });
                });

                var callback = sinon.spy(function () {
                    done();
                });

                test.parallel([func1, func2, func3], 1, callback);
            });
        it('Должен возвращать ошибку, если одна из функций вернула ошибку', function () {
            var func1 = sinon.spy(function (next) {
                next(null, 1);
            });
            var func2 = sinon.spy(function (next) {
                next('error');
            });
            var func3 = sinon.spy(function (next) {
                next(null, 3);
            });
            var callback = sinon.spy();

            test.parallel([func1, func2, func3], callback);

            sinon.assert.calledOnce(func1);
            sinon.assert.calledOnce(func2);
            sinon.assert.calledOnce(func3);
            sinon.assert.calledOnce(callback);
            assert(callback.calledWith('error', [1, undefined, 3]));
        });
    });
    describe('map', function () {
        it('Должен применять функцию к массиву значений', function () {
            var func = sinon.spy(function (value, next) {
                next(null, value * 2);
            });
            var callback = sinon.spy();

            test.map([1, 2, 3], func, callback);

            sinon.assert.calledThrice(func);
            sinon.assert.calledOnce(callback);
            assert(callback.calledWith(null, [2, 4, 6]));
        });
    });
    describe('makeAsync', function () {
        it('Полученную функцию можно использовать в serial', function (done) {

            var callback = function (error, data) {
                assert(error === null);
                assert(data.name === 'barsik');
                assert(data.price === 5000);
                done();
            };
            test.serial([
                function (next) {
                    fs.readFile('./cats/barsik.json', next);
                },
                test.makeAsync(JSON.parse)
            ], callback);
        });
    });
});
