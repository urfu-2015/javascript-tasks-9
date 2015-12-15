'use strict';

module.exports.serial = function (functions, mainCallBack) {
    if (!functions.length) {
        mainCallBack(null, []);
        return;
    }
    var nextFunc;
    var minorCallBack = function (error, data) {
        if (error || !functions.length) {
            mainCallBack(error, data);
        } else {
            nextFunc = functions.shift();
            nextFunc(data, minorCallBack);
        }
    };
    var func = functions.shift();
    func(minorCallBack);
};

module.exports.parallel = function (functions, mainCallBack) {
    if (!functions.length) {
        mainCallBack(null, []);
        return;
    }
    var result = [];
    var minorCallBack = function (error, data) {
        if (!error) {
            result.push(data);
        } else {
            mainCallBack(error, result);
            return;
        }
    };
    for (var i = 0; i < functions.length; i++) {
        functions[i](minorCallBack);
    }
};

module.exports.map = function (values, func, mainCallBack) {
    var result = [];
    var value;
    var minorCallBack = function (error, data) {
        if (!error && values.length) {
            result.push(data);
        } else {
            mainCallBack(error, result);
        }
    };
    while (values.length) {
        value = values.shift();
        func(value, minorCallBack);
    }
};
