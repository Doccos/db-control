'use strict'
let rawTable = require("./table");
let rawColumn = require("./columns/mainColumn")
let createTable = require("./createTable")
let alterTable = require("./alterTable")

class Control {

    constructor(dbName, mysql) {
        this._tables = []; //tables to add
        this._availableTables = []; //Tables available in database
        this._dbName = dbName;
        this._mysql = mysql;
        this._queryPool = {
            createDatabase: [],
            createTables: [],
            alterTables: [],
            deleteColumns: [],
            deleteTables: [],

        };
        this._isDbAvailable = false;
    }

    addTable(table) {
        this._tables.push(table);
    }

    async getQuerys() {
        await this._checkIfDatabaseExists();
        await this._checkTables();

    }

    async _checkTables() {
        if (this._isDbAvailable) {
            await this._readAllTables();
            await this._readAllColumns();
            this._checkForMissingTables();
            this._checkForAlterTables();
        } else {
            this._createAllTables();
        }
    }

    _checkForAlterTables() {
        for (let table of this._tables) {
            for (let availableTable of this._availableTables) {
                if (availableTable.tableName === table.tableName) {
                    let t = new alterTable(table, availableTable, this._dbName);
                    this._queryPool.alterTables = t.alter();
                }
            }

        }

    }

    _checkForMissingTables() {
        for (let table of this._tables) {
            let found = false;
            for (let availableTable of this._availableTables) {
                if (availableTable.tableName === table.tableName)
                    found = true;
            }
            if (!found)
                this._createTable(table, this._dbName);
        }
    }

    async _createAllTables() {
        for (let table in this._tables) {
            this._queryPool.createTables.push({query: this._createTable(this._tables[table])})
        }
    }

    _createTable(table) {
        let t = new createTable(table, this._dbName);
        this._queryPool.createTables.push({query: t.create()});
    }

    async _readAllColumns() {

            for (let id in this._availableTables) {
                await this._parseColumns(id);
            }



    }
    _parseColumns(id){
        return new Promise(resolve => {
            this._mysql.query("SHOW COLUMNS FROM `" + this._dbName + "`.`" + this._availableTables[id].tableName + "`", (err, rows, fields) => {
                for (let row of rows) {
                    let field = row.Field;
                    let data = /(\w+)\(?([0-9,]+)?\)?\s?(unsigned)?\s?(zerofill)?/.exec(row.Type);
                    let type = data[1];
                    let length = (typeof data[2] !== 'undefined') ? data[2] : null;
                    let unsigned = (data[3] === undefined) ? false : true;
                    let zerofill = (data[4] === undefined) ? false : true;
                    let primKey = (row.Key === 'PRI') ? true : false;
                    let extra = row.Extra;
                    let nullAllowd = (row.Null === 'YES') ? true : false;
                    let defaultVal = (row.Default === null) ? '' : row.Default;
                    let c = new rawColumn(type, field, length, nullAllowd, defaultVal, unsigned, primKey);
                    c.isAutoIncrement = (row.Extra == 'auto_increment') ? true : false;
                    this._availableTables[id].addColumn(c);
                    resolve(1)
                }

            });
        })
    }
    _readAllTables() {
        return new Promise(resolve => {

            this._mysql.query("SHOW TABLES FROM " + this._dbName, (err, rows, fields) => {
                for (let table of rows) {
                    let t = new rawTable(table["Tables_in_" + this._dbName]);
                    this._availableTables.push(t);
                }

                resolve(1);
            })
        });
    }

    _checkIfDatabaseExists() {
        return new Promise(resolve => {
            this._mysql.query("SHOW DATABASES", (err, rows, fields) => {
                for (let row of rows) {
                    if (row.Database == this._dbName)
                        this._isDbAvailable = true;
                }
                if (!this._isDbAvailable)
                    this._queryPool.createDatabase.push({query: "CREATE DATABASE `" + this._dbName + "` /*!40100 COLLATE 'utf8mb4_bin' */;"})
                resolve(1);

            })
        })

    }


    get queryPool() {
        return this._queryPool;
    }

    set queryPool(value) {
        this._queryPool = value;
    }
}


module.exports.start = Control



