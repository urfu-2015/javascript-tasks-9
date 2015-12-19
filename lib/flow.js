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
    var arraysData = [];
    var index = functions.length;
    var localCallBack = function (error, data) {
        if (!index) {
            callback(null, arraysData);
        } else {
            index--;
            arraysData.push(data);
            if (!index) {
                localCallBack();
            }
        }
    };
    for (var i = 0; i < functions.length; i++) {
        functions[i](localCallBack);
    }
};
module.exports.map = function (values, functions, callback) {
    var arraysData = [];
    var index = 0;
    var exit = false;
    var counter = 0;
    var localCallBack = function (i) {
        return function (error, data) {
            if (!exit) {
                counter += 1;
                arraysData[i] = data;
                if (error || counter === values.length) {
                    callback(error, arraysData);
                }
                if (error) {
                    exit = true;
                }
            }
        };
    };
    for (var i = 0; i < values.length; i++) {
        functions(values[i], localCallBack(i));
    }
};
