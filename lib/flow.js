'use strict';

module.exports.serial = function (functions, mainCallBack) {
    var nextFunc;
    var minorCallBack = function (error, data) {
        if (error && !functions.length) {
            mainCallBack(error, data);
        }
        nextFunc = functions.shift();
        nextFunc(data, minorCallBack);
    };
    var func = functions.shift();
    func(minorCallBack);
};

module.exports.parallel = function (functions, mainCallBack) {
    var result = [];
    var func;
    var minorCallBack = function (error, data) {
        if (!error || functions.length) {
            result.push(data);
        } else {
            mainCallBack(error, result);
        }
    };
    while (functions.length) {
        func = functions.shift();
        func(minorCallBack);
    }
};

module.exports.map = function (values, func, mainCallBack) {
    var result = [];
    var value;
    var minorCallBack = function (error, data) {
        if (!error && values.length) {
            result.push(data);
        } else {
            mainCallBack(error, result);
        }
    };
    while (values.length) {
        value = values.shift();
        func(value, minorCallBack);
    }
};
