'use strict';

exports.serial = function (functions, callback) {
    if (functions.length == 0) {
        return callback(null, []);
    }
    var count = 0;
    var next = function (err, data) {
        count++;
        if (functions.length == count || err) {
            return callback(err, data);
        } else {
            functions[count](data, next);
        }
    };
    functions[count](next);
};

exports.parallel = function (functions, callback) {
    var length = functions.length;
    var limit = length;
    if (arguments.length == 3) {
        limit = Math.min(limit, callback);
        callback = arguments[2];
    }
    if (limit < 0 || length == 0) {
        return callback(null, []);
    }
    var result = getArray(length);
    var count = 0;
    var index = 0;
    var curError;
    var next = function (index) {
        return function (err, data) {
            if (err) {
                curError = curError ? curError : err;
            } else {
                result[index] = data;
                count--;
            }
            if (length - 1 == index) {
                callback(curError, result);
            }
            getNextFunc();
        };
    };
    var getNextFunc = function () {
        while (index < length && count < limit) {
            functions[index](next(index));
            count++;
            index++;
        }
    };
    getNextFunc();
};

function getArray(size) {
    var arr = [];
    for (var i = 0; i < size; i++) {
        arr.push(null);
    }
    return arr;
}

exports.map = function (values, func, callback) {
    var length = values.length;
    if (length == 0) {
        return callback(null, []);
    }
    var result = getArray(length);
    var curError;
    values.forEach(function (value, index, values) {
        func(value, function (err, data) {
            if (err) {
                curError = curError ? curError : err;
            } else {
                result[index] = data;
            }
            if (index == length - 1) {
                callback(curError, result);
            }
        });
    });
};

exports.makeAsync = function (func) {
    return function () {
        var next = arguments[0];
        var data;
        if (arguments.length == 2) {
            data = next;
            next = arguments[1];
        }
        try {
            next(null, func(data));
        } catch (e) {
            next(e);
        }
    };
};
