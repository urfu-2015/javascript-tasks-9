'use strict';

function serial(func, cb) {
    func[0](function (err, data) {
        if (err) {
            cb(err);
        } else {
            func[1](data, function (err, data) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, data);
                }
            });
        }
    });
}

function parallel(func, cb) {
    var result = new Array(func.length);
    func.forEach(function (item, i) {
        item(function (err, data) {
            if (err) {
                cb(err);
            }
            result[i] = data;
            if (full(result)) {
                cb(null, result);
            }
        });
    });
}

function map(array, func, cb) {
    var result = new Array(array.length);
    array.forEach(function (item, i) {
        func(item, function (err, data) {
            if (err) {
                cb(err);
            }
            result[i] = data;
            if (full(result)) {
                cb(null, result);
            }
        });
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
