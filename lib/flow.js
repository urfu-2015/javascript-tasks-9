'use strict';

module.exports.serial = function (funcArray, callback) {
    var count = 0;
    var locCallback = function (error, data) {
        count += 1;

        if (error || count === funcArray.length) {
            callback(error, data);
            return;
        }

        if (count < funcArray.length) {
            funcArray[count](data, locCallback);
        }
    };

    funcArray[0](locCallback);
};

module.exports.parallel = function (funcArray, callback) {
    var res = [];
    var createLocCallback = function (index) {

        return function (error, data) {

            if (!error) {
                res[index] = data;
            }

            if (error || funcArray.length == res.length) {
                callback(error, res);
            }
        };
    };

    funcArray.forEach(function (func, funcIndex) {
        func(createLocCallback(funcIndex));
    });
};


module.exports.map = function (vals, func, callback) {
    var res = [];
    var index = 0;
    var createLocCallback = function (index) {

        return function (error, data) {

            if (!error) {
                res[index] = data;
            }

            if (vals.length === res.length || error) {
                callback(error, res);
            }
        };
    };
    
    vals.forEach(function (val, valIndex) {
        func(val, createLocCallback(valIndex));
    });
};
