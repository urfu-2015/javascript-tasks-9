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
    functions.length === 0 ? mainCallback() : functions[0](callback);
};

module.exports.parallel = function (functions, mainCallback) {
    var counter = functions.length;
    var result = [];
    var isCbCall = false;
    var callback = function (error, data) {
        counter = counter - 1;
        if (error) {
            if (isCbCall) {
                return;
            } else {
                mainCallback(error, data);
                isCbCall = true;
            };
        } else {
            result.push(data);
        };
        if (counter === 0) {
            mainCallback(error, result);
        };
    };
    if (functions.length === 0) {
        mainCallback(null, result);
    } else {
        for (var index = 0; index < functions.length; index++) {
            functions[index](callback);
        };
    };
};

module.exports.map = function (values, func, mainCallback) {
    var funcsWithParam = [];
    values.forEach(function (value) {
        funcsWithParam.push(function (callback) {
            func(value, callback);
        });
    });
    module.exports.parallel(funcsWithParam, mainCallback);
};
