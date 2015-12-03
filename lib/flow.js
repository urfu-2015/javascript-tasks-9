'use strict';

exports.serial = function (functions, callback) {
    if (functions.length == 0) {
        callback(null, []);
        return;
    }
    var count = 0;
    var next = function (err, data) {
        count++;
        if (functions.length == count || err) {
            callback(err, data);
        } else {
            functions[count](data, next);
        }
    };
    functions[count](next);
};

exports.parallel = function (functions, callback) {
    if (functions.length == 0) {
        callback(null, []);
        return;
    }
    var length = functions.length;
    var limit = length;
    if (arguments.length == 3) {
        limit = Math.min(limit, callback);
        callback = arguments[2];
    }
    var result = getArray(length);
    functions.forEach = function (fn, thisObj) {
        for (var i = 0; i < limit; i++) {
            if (i in this) {
                fn.call(thisObj, this[i], i, this);
            }
            limit = Math.min(limit + result.length, length);
        }
    };
    functions.forEach(function (func, index, functions) {
        func(function (err, data) {
            if (err) {
                callback(err, data);
            } else {
                result[index] = data;
            }
            if (length - 1 == index) {
                callback(err, result);
            }
        });
    });
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
        callback(null, []);
        return;
    }
    var result = getArray(length);
    values.forEach(function (value, index, values) {
        func(value, function (err, data) {
            if (err) {
                callback(err, data);
            } else {
                result[index] = data;
            }
            if (index == length - 1) {
                callback(null, result);
            }
        });
    });
};

exports.makeAsync = function (func) {
    return function () {
        try {
            var data;
            var next = arguments[0];
            if (arguments.length == 2) {
                data = next;
                next = arguments[1];
            }
            next(null, func(data));
        } catch (e) {
            next(e);
        }
    };
};
