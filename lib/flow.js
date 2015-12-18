'use strict';

module.exports.serial = function (funcList, callback) {
    var funcCounter = 0;
    var _callback = function (error, data) {
        if (error || (funcCounter === funcList.length)) {
            return callback(error, data);
        }
        var func = funcList[funcCounter];
        func.length === 1 ? func(_callback) : func(data, _callback);
        funcCounter++;
    };
    _callback();
};

module.exports.parallel = function (funcList, callback) {
    var funcResults = [];
    var errorFound = null;
    var _callback = function (error, data) {
        funcResults[this.i] = data;
        if (error && !errorFound) {
            errorFound = error;
        }
        if (funcList.length === funcResults.length) {
            return callback(errorFound, funcResults);
        }
    };
    funcList.forEach(function (func, index) {
        func(_callback.bind({i: index}));
    });
};

module.exports.map = function (valueList, func, callback) {
    var funcResults = [];
    var errorFound = null;
    var _callback = function (error, data) {
        funcResults[this.i] = data;
        if (error && !errorFound) {
            errorFound = error;
        }
        if (valueList.length === funcResults.length) {
            return callback(errorFound, funcResults);
        }
    };
    valueList.forEach(function (value, index) {
        func(value, _callback.bind({i: index}));
    });
};
