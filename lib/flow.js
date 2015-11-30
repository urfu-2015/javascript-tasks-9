'use strict';

module.exports.serial = function (funcArray, callback) {
    var next = function (error, data) {
        if (error) {
            callback(error);
            return;
        }
        var countFunc = funcArray.length;
        if (countFunc == 0) {
            //error?
            return;
        }
        if (i == countFunc) {
            callback(null, data);
            return;
        }
        if (data) {
            funcArray[i](data, next);
            i += 1;
            return;
        }
        funcArray[i](next);
        i += 1;
    };
    var i = 0;
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
