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
    var functionsCount = functionsArray.length;
    var currentCallback = function (error, nextData) {
        accArray.push(nextData);
        if (accArray.length === functionsCount || error) {
            callback(error, nextData);
        };
    };
    for (var i = 0; i < functionsCount; i++) {
        setTimeout(functionsArray[i], 0, currentCallback);
    };
};

module.exports.map = function (valuesArray, func, callback) {
    var accArray = [];
    var currentCallback = function (error, nextData) {
        accArray.push(nextData);
        if (accArray.length === valuesArray.length || error) {
            callback(error, accArray);
        };
    };
    for (var i = 0; i < valuesArray.length; i++) {
        setTimeout(func, 0, valuesArray[i], currentCallback);
    };
};
