'use strict'

class Control {

    constructor(dbName, mysql) {
        this.tables = [];
        this.dbName = dbName;
        this.mysql = mysql;

    }

    addTable(table){
        this.tables.push(table);
    }


}


module.exports.start = Control



