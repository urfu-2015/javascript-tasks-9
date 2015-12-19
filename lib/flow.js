'use strict';

module.exports.serial = function (funcArray, callback) {
    function cb(error, data) {
        if (error) {
            callback(error);
        } else if (funcArray.length) {
            funcArray.shift()(data, cb);
        } else {
            callback(null, data);
        }
    }
    if (funcArray.length === 0) {
        callback(new RangeError('funcArray.length must be more than 0'));
    }
    funcArray.shift()(cb);
};

module.exports.parallel = function (funcArray, limit, callback) {
    if (typeof limit === 'function') {
        callback = limit;
        limit = funcArray.length;
    }
    if (limit <= 0 || funcArray.length === 0) {
        callback(new RangeError('limit or funcArray.length must be more than 0'));
    }
    var countFuncRunning = 0;

    function getPromise(func) {
        return new Promise((resolve, reject) => {
            var timerId = setInterval(() => {
                if (countFuncRunning < limit) {
                    countFuncRunning++;
                    func((error, data) => {
                        countFuncRunning--;
                        error ? reject(error) : resolve(data);
                    });
                    clearInterval(timerId);
                }
            }, 0);
        });
    }

    Promise.all(funcArray.map(getPromise))
        .then(results => {
            callback(null, results);
        }, error => {
            callback(error);
        });
};

module.exports.map = function (valueArray, func, callback) {
    if (valueArray.length === 0) {
        callback(new RangeError('valueArray.length must be more than 0'));
    }
    function getPromise(value) {
        return new Promise((resolve, reject) => {
            func(value, (error, data) => {
                error ? reject(error) : resolve(data);
            });
        });
    }

    Promise.all(valueArray.map(getPromise))
        .then(results => {
            callback(null, results);
        }, error => {
            callback(error);
        });
};

module.exports.makeAsync = function (func) {
    return (data, callback) => {
        data.length ? callback(null, func(data)) :
            callback(new Error('data not received'));
    };
};
