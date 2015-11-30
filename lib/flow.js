'use strict';

module.exports.serial = function (functions, callback) {
    var index = 0;
    var serialCallback = function (error, data) {
        ++index;
        if (error || index >= functions.length) {
            callback(error, data);
            return;
        }
        functions[index](data, serialCallback);
    };
    functions[0](serialCallback);
};

module.exports.parallel = function (functions, callback) {
    var counter = 0;
    var result = [];
    var parallelCallback = function (error, data) {
        ++counter;
        result.push(data);
        if (error || counter === functions.length) {
            callback(error, result);
        }
    };
    functions.forEach(function (item) {
        setTimeout(item, 0, parallelCallback);
    });
};

module.exports.map = function (values, func, callback) {
    var adaptFunctions = [];
    values.forEach(function (value) {
        adaptFunctions.push(
            function (callback) {
                func(value, callback);
            });
    });
    module.exports.parallel(adaptFunctions, callback);
};
