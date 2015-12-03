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
    if (func.length > 0){
        func[index](callback);
    } else {
        cb(null, null);
    }

}

function parallelCallback(index, cb) {
    var _this = this;
    return function (err, data) {
        if (err) {
            cb(err);
        }
        _this[index] = {value:data};
        if (full(_this)) {
            cb(null, unpackObjects(_this));
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
        if (array[i] === undefined) {
            return false;
        }
    }
    return true;
}

function unpackObjects(array) {
    var result = [];
    array.forEach(function (item, index) {
        result[index] = item.value;
    });
    return result;
}


exports.serial = serial;
exports.parallel = parallel;
exports.map = map;
