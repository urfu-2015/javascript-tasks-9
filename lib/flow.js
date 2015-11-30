'use strict';

module.exports.serial = function (functions, callback) {
    var next_index = 0;
    var processData = function (error, data) {
        if (error || next_index >= functions.length - 1) {
            callback(error, data);
        } else {
            next_index += 1;
            functions[next_index](data, processData);
        }
    };
    functions[0](processData);
};

module.exports.parallel = function (functions, callback) {
    var result = [];
    var getData = function (error, data) {
        result.push(data);
        if (error || result.length >= functions.length) {
            callback(error, result);
        }
    };
    for (var i = 0; i < functions.length; i++) {
        setTimeout(functions[i], 0, getData);
    }
};

module.exports.map = function (values, func, callback) {
    var functions = [];
    for (var i = 0; i < values.length; i++) {
        functions.push(func.bind(null, values[i]));
    }
    module.exports.parallel(functions, callback);
};
