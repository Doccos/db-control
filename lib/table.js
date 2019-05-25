'use strict'

class Table {
    constructor(tableName) {
        this.rows = [];
        this.tableName = tableName;

    }
    addRow(row) {
        this.rows.push(row);
    }

}


module.exports.table = Table;