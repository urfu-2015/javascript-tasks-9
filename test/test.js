'use strict';

var flow = require('../lib/flow');
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);
var expect = chai.expect;

var func1 = function (next) {
    next('error');
};
var func2 = function (next) {
    next(null, 1);
};
var func3 = function (next) {
    next('error');
};
var callback = function () {};
var spy1 = chai.spy(func1);
var spy2 = chai.spy(func2);
var spy3 = chai.spy(func3);
var spyCb = chai.spy(callback);
describe('parallel', function () {
    it('Должен возвращать ошибку, если одна из функций вернула ошибку', function () {

        flow.parallel([spy1, spy2, spy3], spyCb);

        expect(spy1).to.have.been.called.once;
        expect(spy2).to.have.been.called.once;
        expect(spy3).to.have.been.called.once;
        expect(spyCb).to.have.been.called.once;
    });
});
