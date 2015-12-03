'use strict';

function serial(func, cb) {
    var index = 0;
    function callback(err, data) {
        if (err) {
            cb(err);
        } else {
            index ++;
            if (index === func.length) {
                cb(null, data);
            } else {
                func[index](data, callback);
            }
        }
    }
    func[index](callback);
}

function parallelCallback(index, cb) {
    var _this = this;
    return function (err, data) {
        if (err) {
            cb(err);
        }
        _this[index] = data;
        if (full(_this)) {
            cb(null, _this);
        }
    };
}

function parallel(funcs, cb) {
    var result = new Array(funcs.length);
    funcs.forEach(function (func, i) {
        func(parallelCallback.call(result, i, cb));
    });
}

function map(array, func, cb) {
    var result = new Array(array.length);
    array.forEach(function (item, i) {
        func(item, parallelCallback.call(result, i, cb));
    });
}

function full(array) {
    for (var i = 0; i < array.length; i++) {
        if (typeof array[i] === 'undefined') {
            return false;
        }
    }
    return true;
}

exports.serial = serial;
exports.parallel = parallel;
exports.map = map;
