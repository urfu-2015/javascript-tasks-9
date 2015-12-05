'use strict';

module.exports.serial = function (functions, callback) {
    var nextIndex = 0;
    var processData = function (error, data) {
        if (error || nextIndex >= functions.length - 1) {
            callback(error, data);
        } else {
            nextIndex += 1;
            functions[nextIndex](data, processData);
        }
    };
    if (functions.length === 0) {
        callback(error, []);
    } else {
        functions[0](processData);
    }
};

module.exports.parallel = function (functions, callback) {
    var result = [];
    var errors = [];
    functions.forEach(function (func, index, functions) {
        func(function (error, data) {
            if (error) {
                errors.push(error);
            }
            result[index] = data;
            if (index === functions.length - 1) {
                if (errors.length !== 0) {
                    callback(errors[0], result);
                } else {
                    callback(error, result);
                }
            }
        });
    });
};

module.exports.map = function (values, func, callback) {
    var functions = values.map(function (value) {
        return func.bind(null, value);
    });
    module.exports.parallel(functions, callback);
};
