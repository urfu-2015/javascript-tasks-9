'use strict';

exports.serial = serial;
exports.parallel = parallel;

function serial(functions, callback) {
    var index = 0;
    var funcsLength = functions.length - 1;
    function serialCallback(error, data) {
        if (!error && index !== funcsLength){
            functions[++index](data, serialCallback);
        } else {
            callback(error, data);
        }
    }
    functions[0](serialCallback);
}



function parallel (functions, callback) {
    var results = [];
    var funcsLength = functions.length - 1;
    functions.forEach(function (func, index, functions) {
        func(function (error, data) {
            if (error) {
                callback(error, data);
            }
            results.push(data);
            if (index === functions.length - 1) {
                callback(null, results);
            }
        });
    });
}

exports.map = function (values, func, callback) {
    var results = [];
    var valuesLength = values.length - 1;
    function mapCallback(error, data) {
        if (!error) {
            results.push(data);
        }
        if (error || results.length === valuesLength){
            callback(error, results);
        }
    }
    values.forEach(function (value) {
        func(value, mapCallback);
    });
};
