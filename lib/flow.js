'use strict';

module.exports.serial = function (functions, mainCallback) {
    var index = 0;
    var callback = function (error, data) {
        if (error || index === functions.length - 1) {
            mainCallback(error, data);
        } else {
            functions[++index](data, callback);
        };
    };
    functions.length === 0 ? mainCallback(error, null) : functions[0](callback);//?
};

module.exports.parallel = function (functions, mainCallback) {
    var counter = functions.length;
    var result = [];
    var callback = function (error, data) {
        counter = counter - 1;
        if (error) {
            mainCallback(error, data);
        } else {
            result.push(data);
        };
        if (counter === 0) {
            mainCallback(error, result);
        }
    };
    if (functions.length === 0) {
        mainCallback(error, null);
    } else {
        for (var index = 0; index < functions.length; index++) {
            functions[index](callback);
        };
    };
};

module.exports.map = function (values, func, mainCallback) {
    var counter = values.length;
    var result = [];
    var callback = function (error, data) {
        counter = counter - 1;
        if (error) {
            mainCallback(error, data);
        } else {
            result.push(data);
        };
        if (counter === 0) {
            mainCallback(error, result);
        };
    };
    if (values.length === 0) {
        mainCallback(error, null);
    } else {
        for (var index = 0; index < values.length; index++) {
            func(values[index], callback);
        };
    };
};
