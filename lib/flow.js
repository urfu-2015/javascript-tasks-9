'use strict';

module.exports.serial = function (funcList, callback) {
    var i = 0;
    var _callback = function (error, data) {
        if (error || (i === funcList.length)) {
            return callback(error, data);
        }
        var func = funcList[i];
        func.length === 1 ? func(_callback) : func(data, _callback);
        i++;
    };
    _callback();
};

module.exports.parallel = function (funcList, callback) {
    var funcResults = [];
    var funcCounter = 0;
    var _callback = function (error, data) {
        funcResults[this.i] = data;
        if (funcCounter === funcResults.length) {
            return callback(null, funcResults);
        }
    };
    funcList.forEach(function (func) {
        func(_callback.bind({i: funcCounter++}));
    });
};

module.exports.map = function (valueList, func, callback) {
    var funcResults = [];
    var funcCounter = 0;
    var _callback = function (error, data) {
        funcResults[this.i] = data;
        if (funcCounter === funcResults.length) {
            return callback(null, funcResults);
        }
    };
    valueList.forEach(function (value) {
        func(value, _callback.bind({i: funcCounter++}));
    });
};
