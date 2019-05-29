let builder = require("./builder")

class CreateTable {
    constructor(table, dbName){
        this._table = table;
        this._query = '';
        this._primeryKey = [];
        this._dbName = dbName;
    }
    create() {
        this._query += 'CREATE TABLE '
        this._query += '`'+this._dbName+'`.`'+this._table.tableName+'` (';
        let isfirst = true;
        for(let column of this._table.columns){
            if(isfirst)
                isfirst = false;
            else
                this._query += ', ';

            this._query += builder.column(column)

            if(column.isPrimaryKey === true)
                this._primeryKey.push(column.name);


        }
        if(this._primeryKey.length > 0){
            this._query += ', PRIMARY KEY(';
            let isFirstKey = true
            for(let key of this._primeryKey) {
                if(isFirstKey)
                    isFirstKey = false
                else
                    this._query += ', ';

                this._query += '`'+key+'`';
            }
            this._query += ')';
        }
        this._query +=') COLLATE=\'utf8mb4_bin\'';
        return this._query;
    }
}

module.exports = CreateTable;