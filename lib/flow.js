'use strict';

module.exports.serial = function (funcList, callback) {
    var i = 0;
    var _callback = function (error, data) {
        if (error || (i === funcList.length)) {
            callback(error, data);
            return;
        }
        var func = funcList[i];
        func.length === 1 ? func(_callback) : func(data, _callback);
        i++;
    };
    _callback();
};

module.exports.parallel = function (funcList, callback) {
    var funcResults = [];
    var _callback = function (error, data) {
        funcResults.push(data);
    };
    funcList.forEach(function (func) {
        func(_callback);
    });
    setTimeout(function () {
        return callback(null, funcResults);
    }, 1000);
};

module.exports.map = function (valueList, func, callback) {
    var funcResults = [];
    var _callback = function (error, data) {
        funcResults.push(data);
    };
    valueList.forEach(function (value) {
        func(value, _callback);
    });
    setTimeout(function () {
        return callback(null, funcResults);
    }, 1000);
};
