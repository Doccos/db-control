'use strict'

let control = require("./lib/control");
let table = require("./lib/table");
let varchar = require("./lib/columns/varchar");
let int = require("./lib/columns/int");

module.exports.control = function (dbName, mysql) {
    return new control.start(dbName, mysql)
}

module.exports.newTable = function (tableName) {
    return new table(tableName);
}

module.exports.varChar = function (name, length, isNullAllowed, defaultVal, isUnsigned, isPrimaryKey) {
    return new varchar(name, length, isNullAllowed, defaultVal, isUnsigned, isPrimaryKey);
}
module.exports.int = function (name, length, isNullAllowed, defaultVal, isUnsigned, isPrimaryKey, isAutoIncrement) {
    return new int(name, length, isNullAllowed, defaultVal, isUnsigned, isPrimaryKey, isAutoIncrement);
}


