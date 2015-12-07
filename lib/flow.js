'use strict';

module.exports.serial = function (funcs, callback) {
    var i = 0;
    var innerCallback = function (error, data) {
        if (error || i === funcs.length - 1) {
            callback(error, data);
        }
        i++;
        if (i < funcs.length) {
            funcs[i](data, innerCallback);
        }
    };
    funcs[0](innerCallback);
};

module.exports.parallel = function (funcs, callback) {
    var counter = funcs.length;
    var allData = [];
    var innerCallback = function (index) {
        return function (error, data) {
            counter--;
            allData[index] = data;
            if (error || counter == 0) {
                callback(error, allData);
            }
        };
    };
    for (var i = 0; i < funcs.length; i++) {
        setTimeout(funcs[i], 0, innerCallback(i));
    }
};

module.exports.map = function (values, func, callback) {
    var counter = values.length;
    var allData = [];
    var innerCallback = function (index) {
        return function (error, data) {
            counter--;
            allData[index] = data;
            if (error || counter == 0) {
                callback(error, allData);
            }
        };
    };
    for (var i = 0; i < values.length; i++) {
        setTimeout(func, 0, values[i], innerCallback(i));
    }
};
