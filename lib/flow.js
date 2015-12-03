'use strict';

module.exports.serial = function (funcArray, callback) {
    var next = function (error, data) {
        if (error) {
            callback(error);
            return;
        }
        if (nextFunctions.length == 0) {
            callback(null, data);
            return;
        }
        if (data) {
            nextFunctions.shift()(data, next);
            return;
        }
        nextFunctions.shift()(next);
    };
    if (funcArray.length == 0) {
        return;
    }
    var nextFunctions = funcArray.slice();
    next();
};

module.exports.parallel = function (funcArray, callback) {
    var resArray = [];
    var next = function (error, data) {
        if (error) {
            callback(error);
            return;
        }
        resArray.push(data);
        if (resArray.length == funcArray.length) {
            callback(null, resArray);
        }
    };
    funcArray.forEach(function (func) {
        func(next);
    });
};

module.exports.map = function (valueArray, func, callback) {
    var resArray = [];
    var next = function (error, data) {
        if (error) {
            callback(error);
            return;
        }
        resArray.push(data);
        if (resArray.length == valueArray.length) {
            callback(null, resArray);
        }
    };
    valueArray.forEach(function (value) {
        func(value, next);
    });
};
