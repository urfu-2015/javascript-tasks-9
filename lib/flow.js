'use strict';

module.exports.serial = function (functions, callback) {
    var index = 0;
    var localCallback = function (error, data) {
        if (!error && index != functions.length - 1) {
            index++;
            functions[index](data, localCallback);
        } else {
            callback(error, data);
        }
    };
    functions[index](localCallback);

};
module.exports.parallel = function (functions, callback) {
    var index = 0;
    var arraysData = [];
    var localCallback = function (error, data) {
        if (!error && i != functions.length - 1) {
            arraysData.push(data);
        } else {
            callback(error, arraysData);
        }
    };
    for (var i = 0; i < functions.length; i++) {
        setTimeout(functions[i](localCallback), 0);
    }
};
module.exports.map = function (values, functions, callback) {
    var arraysData = [];
    var localCallback = function (error, data) {
        if (!error && i != functions.length - 1) {
            arraysData.push(data);
        } else {
            callback(error, arraysData);
        }
    };
    for (var i = 0; i < functions.length; i++) {
        setTimeout(functions[i](values[i], localCallback), 0);
    }
};
