'use strict';

module.exports.serial = function (functionsArray, callback) {
    var currentIndex = 0;
    var currentCallback = function (error, nextData) {
        if (currentIndex === functionsArray.length - 1 || error) {
            callback(error, nextData);
        } else {
            currentIndex++;
            functionsArray[currentIndex](nextData, currentCallback);
        };
    };
    functionsArray[0](currentCallback);
};

module.exports.parallel = function (functionsArray, callback) {
    var accArray = [];
    var flag = false;
    var functionsCount = functionsArray.length;
    var currentCallback = function (error, nextData) {
        accArray[i] = nextData;
        if (accArray.length === functionsCount || error) {
            flag = true;
            callback(error, nextData);
        };
    };
    for (var i = 0; i < functionsCount; i++) {
        if (flag) {
            return;
        }
        functionsArray[i](0, currentCallback);
    };
};

module.exports.map = function (valuesArray, func, callback) {
    var accArray = [];
    var flag = false;
    var currentCallback = function (error, nextData) {
        if (accArray.length === valuesArray.length || error) {
            callback(error, accArray);
        };
        accArray[i] = nextData;
    };
    for (var i = 0; i < valuesArray.length; i++) {
        if (flag) {
            return;
        }
        func(valuesArray[i], currentCallback);
    };
};
