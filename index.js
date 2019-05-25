'use strict'

let control = require("./lib/control");
let table = require("./lib/table");
let varchar = require("./lib/columns/varchar");

module.exports.control = function (dbName, mysql) {
    return new control.start(dbName, mysql)
}

module.exports.newTable = function (tableName) {
    return new table.table(tableName);
}

module.exports.varChar = function (length, isNullAllowed, defaultVal, isUnsigned, isPrimaryKey) {
    return new varchar(length, isNullAllowed, defaultVal, isUnsigned, isPrimaryKey);
}


