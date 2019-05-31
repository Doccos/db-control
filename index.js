'use strict'

let control = require("./lib/control");
let table = require("./lib/table");
let varchar = require("./lib/columns/varchar");
let int = require("./lib/columns/int");
let timestamp = require("./lib/columns/timestamp");
let mainColumn = require("./lib/columns/mainColumn")
module.exports.control = function (dbName, mysql) {
    return new control.start(dbName, mysql)
}

module.exports.newTable = function (tableName) {
    return new table(tableName);
}

module.exports.varChar = function (name, length, isNullAllowed, defaultVal, isUnsigned, isPrimaryKey) {
    let r = new mainColumn("varchar", name, length, isNullAllowed, defaultVal, isUnsigned, isPrimaryKey)
    return r;
}
module.exports.int = function (name, length, isNullAllowed, defaultVal, isUnsigned, isPrimaryKey, isAutoIncrement) {
    let r = new mainColumn("int", name, length, isNullAllowed, defaultVal, isUnsigned, isPrimaryKey);
    r.isAutoIncrement = isAutoIncrement
    return r;
}

module.exports.timestamp = function (name, defaultVal, isPrimaryKey,currentTS, onUpdtCurrTS) {
    let r = new mainColumn("timestamp", name, null, false, defaultVal, false, isPrimaryKey);
    r.currentTS = currentTS;
    r.onUpdCurTS = onUpdtCurrTS;
    return r;
}


//KEYS FOR RELATION

module.exports.relationKeyRestrict = 'RESTRICT';
module.exports.relationKeyCascade = 'CASCADE';
module.exports.relationKeyNoAction = 'NO ACTION';
module.exports.relationKeySetNull = 'SET NULL';


