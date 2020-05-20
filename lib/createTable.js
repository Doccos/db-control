'use strict'

let builder = require("./builder")

class CreateTable {
    constructor(table, dbName){
        this._table = table;
        this._query = '';
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

            this._query += builder.column(column, true)



        }
        if(this._table.keys.primaryKey.length > 0){
            this._query += ', PRIMARY KEY(';
            let isFirstKey = true;
                for(let key of this._table.keys.primaryKey){
                    if(isFirstKey)
                        isFirstKey = false
                    else
                        this._query += ', ';

                    this._query += key.getKeyString();
                }

            this._query += ') '
        }

        if(this._table.keys.fulltextKey.length > 0){
            for(let key of this._table.keys.fulltextKey){
                this._query += ', FULLTEXT KEY `'+key.keyName+'` (';
                this._query += key.getKeyString();
                this._query += ') '

            }

        }
        if(this._table.keys.uniqueKey.length > 0){
            for(let key of this._table.keys.uniqueKey){
                this._query += ', UNIQUE KEY `'+key.keyName+'` (';
                this._query += key.getKeyString();
                this._query += ') '

            }

        }
        if(this._table.keys.key.length > 0){
            for(let key of this._table.keys.key){
                this._query += ', KEY `'+key.keyName+'` (';
                this._query += key.getKeyString();
                this._query += ') '

            }

        }

        this._query +=') COLLATE=\'utf8mb4_bin\'';
        return this._query;
    }
}

module.exports = CreateTable;