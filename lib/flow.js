'use strict';

module.exports.serial = function (fArray, callback) {
    if (fArray.length === 0) {
        return;
    }
    var residue = fArray.splice(1, fArray.length - 1);
    fArray[0](function (error, data) {
        if (error) {
            callback(error);
        } else {
            if (residue.length > 1) {
                var current = residue[0];
                residue = residue.splice(1, residue.length - 1);
                current(data, next);
            } else {
                residue[0](data, callback);
            }
        }
    });
};

module.exports.parallel = function (fArray, callback) {
    var result = [];
    fArray.forEach(function (elem) {
        elem(function next(error, data) {
            if (error) {
                callback(error);
            } else {
                result.push(data);
            }
            if (result.length === fArray.length) {
                callback(error, result);
            }
        });
    });
};

module.exports.map = function (vArray, func, callback) {
    var result = [];
    vArray.forEach(function (elem) {
        func(elem, function next(error, data) {
            if (error) {
                callback(error);
            } else {
                result.push(data);
            }
            if (result.length === vArray.length) {
                callback(error, result);
            }
        });
    });
};
