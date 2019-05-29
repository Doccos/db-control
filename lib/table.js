'use strict'

class Table {
    constructor(tableName) {
        this._columns = [];
        this._tableName = tableName;

    }
    addColumn(column) {
        this._columns.push(column);
    }


    get tableName() {
        return this._tableName;
    }

    set tableName(value) {
        this._tableName = value;
    }

    get columns() {
        return this._columns;
    }

    set columns(value) {
        this._columns = value;
    }
}


module.exports = Table;