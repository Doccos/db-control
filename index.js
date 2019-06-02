'use strict'

let control = require("./lib/control");
let table = require("./lib/table");
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

module.exports.datetime = function (name, defaultVal, isPrimaryKey,currentTS, onUpdtCurrTS) {
    let r = new mainColumn("datetime", name, null, false, defaultVal, false, isPrimaryKey);
    r.currentTS = currentTS;
    r.onUpdCurTS = onUpdtCurrTS;
    return r;
}
module.exports.date = function (name, defaultVal, isPrimaryKey,currentTS, onUpdtCurrTS) {
    let r = new mainColumn("date", name, null, false, defaultVal, false, isPrimaryKey);
    r.currentTS = currentTS;
    r.onUpdCurTS = onUpdtCurrTS;
    return r;
}
module.exports.time = function (name, defaultVal, isPrimaryKey,currentTS, onUpdtCurrTS) {
    let r = new mainColumn("time", name, null, false, defaultVal, false, isPrimaryKey);
    r.currentTS = currentTS;
    r.onUpdCurTS = onUpdtCurrTS;
    return r;
}


//KEYS FOR RELATION

module.exports.relationKeyRestrict = 'RESTRICT';
module.exports.relationKeyCascade = 'CASCADE';
module.exports.relationKeyNoAction = 'NO ACTION';
module.exports.relationKeySetNull = 'SET NULL';


