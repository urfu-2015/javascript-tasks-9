'use strict';

module.exports.serial = function (functions, mainCallback) {
    var index = 0;
    var callback = function (error, data) {
        if (error || index === functions.length - 1) {
            mainCallback(error, data);
        };
        index = index + 1;
        if (index < functions.length) {
            functions[index](data, callback);
        };
    };
    functions[0](callback);
};

module.exports.parallel = function (functions, mainCallback) {
    var counter = functions.length;
    var result = [];
    var callback = function (error, data) {
        counter = counter - 1;
        result.push(data);
        if (error || counter === 0) {
            mainCallback(error, result);
        };
    };
    for (var index = 0; index < functions.length; index++) {
        setTimeout(functions[index], 0, callback);
    }
};

module.exports.map = function (values, func, mainCallback) {
    var counter = values.length;
    var result = [];
    var callback = function (error, data) {
        counter = counter - 1;
        result.push(data);
        if (error || counter === 0) {
            mainCallback(error, result);
        };
    };
    for (var index = 0; index < values.length; index++) {
        setTimeout(func, 0, values[index], callback);
    }
};
