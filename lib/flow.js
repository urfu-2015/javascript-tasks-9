'use strict';

exports.serial = serial;
exports.parallel = parallel;
exports.map = map;


function serial(funcs, callBack) {
    var index = 0;
    var lastData;
    var standartCallBack = (error, data) => {
        index += 1;
        lastData = data;
        if (!error && index < funcs.length) {
            funcs[index](lastData, standartCallBack);
        } else {
            callBack(error, lastData);
        }
    };

    funcs[0](standartCallBack);
};

function parallel(funcs, callBack) {
    var datas = [];
    var func;
    var standartCallBack = (error, data) => {
        if (!error) {
            datas.push(data);
        }
        if (error || datas.length === funcs.length) {
            callBack(error, datas);
        }
    };

    funcs.forEach(func => func(standartCallBack));
};

function map(values, func, callBack) {
    var funcs = [];
    values.forEach(value => {
        funcs.push((cb) => func(value, cb));
    });
    parallel(funcs, callBack);
};
