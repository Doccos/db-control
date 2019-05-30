'use strict'

class Table {
    constructor(tableName) {
        this._columns = [];
        this._tableName = tableName;

    }

    addColumn(column) {
        for(let aColumn of this._columns){
            if(aColumn.name === column.name){
                this.deleteColumn(column.name);
                break;
            }
        }
        this._columns.push(column);
    }

    deleteColumn(columnName) {
        for(let i in this._columns){
            if(this._columns[i].name === columnName)
                this._columns.splice(i,1);

        }
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


}


module.exports = Table;