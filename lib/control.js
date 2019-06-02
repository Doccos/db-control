'use strict'
let rawTable = require("./table");
let rawColumn = require("./columns/mainColumn")
let createTable = require("./createTable")
let alterTable = require("./alterTable")
let relations = require("./relations")
let modelKey = require("./models/key")
let modelRelation = require("./models/relation")
class Control {

    constructor(dbName, mysql) {
        this._tables = []; //tables to add
        this._availableTables = []; //Tables available in database
        this._dbName = dbName;
        this._mysql = mysql;
        this._queryPool = {
            createDatabase: [],
            createTables: [],
            alterAddColumn: [],
            alterChangeColumn: [],
            alterKeyColumn: [],
            alterIncrementColumn: [],
            alterRelations:[],
            alterDeleteColumn: [],
            deleteTables: [],

        };
        this._keys = [];
        this._relations = [];

        this._availableKeys = {};
        this._availableRelations = {};

        this._isDbAvailable = false;

        this._error = false;
    }

    addTable(table) {
        let tableAvailable = false;
        for(let aTable of this._tables) {
            if(aTable.tableName === table.tableName) {
                tableAvailable = true;
                for(let column of table.columns){
                    aTable.addColumn(column);
                }
                break;
            }
        }
        if(!tableAvailable)
            this._tables.push(table);

    }

    async getQuerys() {
        await this._checkIfDatabaseExists();
        if(!this._error)
            await this._checkTables();

    }

    async _checkTables() {
        if (this._isDbAvailable) {
            await this._readAllTables();
            if(!this._error)
                await this._readAllColumns();
            if(!this._error)
                await this._readAllRelationsAndKeys();
            if(!this._error) {

                this._checkForMissingTables();
                this._checkForAlterTables();
                this._checkForDeleteTables();
                this._checkRelations();

            }
        } else {
            this._createAllTables();
            //await this._readAllRelationsAndKeys();
            this._checkRelations();
        }
    }
    _checkRelations() {
        for (let table of this._tables) {
            let r = new relations(table, this._availableRelations[table.tableName], this._queryPool, this._dbName);
            r.create();

        }
    }
    _checkForDeleteTables() {
        // console.log(this._tables);
        for(let dbTables of this._availableTables){
            let available = false;

            for(let tables of this._tables){
                if(tables.tableName === dbTables.tableName)
                    available = true;
            }

            if(!available){
                for(let column of dbTables.columns){
                    let rel = relations.checkIfIsARelation(this._availableRelations, dbTables.tableName, column.name);
                    if(rel)
                        this._queryPool.deleteTables.push({query: relations.dropRelation(this._dbName,  rel)});
                }
                let query = 'DROP TABLE `'+this._dbName+'`.`'+dbTables.tableName+'`'
                this._queryPool.deleteTables.push({query:query});
            }
        }
    }

    _checkForAlterTables() {
        for (let table of this._tables) {
            for (let availableTable of this._availableTables) {
                if (availableTable.tableName === table.tableName) {
                    let t = new alterTable(table, availableTable, this._dbName, this._queryPool, this._availableKeys, this._availableRelations);
                    t.alter();
                    //this._queryPool.alterTables = t.alter();
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

    _parseColumns(id) {
        return new Promise(resolve => {
            this._mysql.query("SHOW COLUMNS FROM `" + this._dbName + "`.`" + this._availableTables[id].tableName + "`", (err, rows, fields) => {
                if(err)
                    this._error = true;
                for (let row of rows) {
                    // console.log(row);
                    let field = row.Field;
                    let data = /(\w+)\(?([0-9,]+)?\)?\s?(unsigned)?\s?(zerofill)?/.exec(row.Type);
                    let type = data[1];
                    let length = (typeof data[2] !== 'undefined') ? data[2] : null;
                    let unsigned = (data[3] === undefined) ? false : true;
                    let zerofill = (data[4] === undefined) ? false : true;
                    let primKey = (row.Key === 'PRI') ? true : false;
                    let extra = row.Extra;
                    let nullAllowed = (row.Null === 'YES') ? true : false;
                    let defaultVal = (row.Default === 'CURRENT_TIMESTAMP') ? '' : row.Default;
                    let c = new rawColumn(type, field, length, nullAllowed, defaultVal, unsigned, primKey);
                    c.isAutoIncrement = (row.Extra == 'auto_increment') ? true : false;
                    c.onUpdCurTS = (row.Extra === 'on update CURRENT_TIMESTAMP')?true:false;
                    c.currentTS = (row.Default === 'CURRENT_TIMESTAMP')?true:false;
                    this._availableTables[id].addColumn(c);
                    // console.log(row);
                    resolve(1)
                }

            });
        })
    }
    async _readAllRelationsAndKeys() {
            for(let table of this._availableTables) {
                await this._readAllRelationsAndKeysSql(table);
            }
    }

    _readAllRelationsAndKeysSql(table) {
        return new Promise(resolve => {
            this._mysql.query('SHOW CREATE TABLE `'+this._dbName+'`.`'+table.tableName+'`', (err, rows, fields) => {
                if(err)
                    this._error = true;
                //let splitted = rows[0]['Create Table'].replace(/\n/g, '').split(',')
                let splitted = rows[0]['Create Table'].replace(/\n/g, '')
                splitted = this._splittTable(splitted);

                for(let line of splitted) {

                    //search for Foreign key
                    // console.log(line);
                    let relation = /CONSTRAINT\s\`(.+)\`\sFOREIGN\sKEY\s\(\`(.+)\`\)\sREFERENCES\s\`(.+)\`\s\(\`(.+)\`\)\s?(ON\sDELETE\s(NO\sACTION|RESTRICT|CASCADE|SET\sNULL))?\s?(ON\sUPDATE\s(NO\sACTION|RESTRICT|CASCADE|SET\sNULL))?/i.exec(line)
                    if(relation !== null){
                        if(!this._availableRelations[table.tableName])
                            this._availableRelations[table.tableName] = [];
                        let r = new modelRelation(table.tableName, relation[2], relation[3], relation[4], relation[8], relation[6]);
                        r.keyName = relation[1];
                        this._availableRelations[table.tableName].push(r);
                        // console.log(relation);

                    }
                    //search for Keys
                    if(relation === null){

                        if(!this._availableKeys[table.tableName])
                            this._availableKeys[table.tableName] = {primaryKey: [], uniqueKey: [], fulltextKey: [], key: []}
                        // console.log(line);
                        let key = /(PRIMARY|UNIQUE|FULLTEXT)?\s?KEY\s\`?(.+?)?\`?\s?\((.+?)\)/i.exec(line);
                        // console.log(key);
                        // console.log(line);
                        if(key !== null){
                            let keyM;
                            keyM = new modelKey(key[3].replace(/\`/ig,'').split(','))
                            keyM.keyName = key[2];
                             // console.log(key[3]);
                            if(key[1] === 'FULLTEXT')
                                this._availableKeys[table.tableName].fulltextKey.push(keyM);
                            else if(key[1] === 'UNIQUE')
                                this._availableKeys[table.tableName].uniqueKey.push(keyM);
                            else if (key[1] === 'PRIMARY')
                                this._availableKeys[table.tableName].primaryKey.push(keyM);
                            else if (key[1] === undefined)
                                this._availableKeys[table.tableName].key.push(keyM);
                        }
                    }




                }
                // console.log(this._availableKeys[table.tableName]);
                resolve(1);
            });

        });
    }
    _splittTable(table){
        table = /.*?\((.+)\).*/i.exec(table);
        let bracketCounter = 0;
        let splitted = [];
        let temp = [];
        for(let char of table[1]){
            if(char === '(')
                bracketCounter++;
            if(char === ')')
                bracketCounter--;
            if(char === ',' && bracketCounter == 0){
                splitted.push(temp.join(''));
                temp=[];
            } else {
                temp.push(char);
            }
        }
        if(splitted.length > 0){
            splitted.push(temp.join(''));

        }
        //console.log(splitted);
        return splitted;
    }
    _readAllTables() {
        return new Promise(resolve => {

            this._mysql.query("SHOW TABLES FROM " + this._dbName, (err, rows, fields) => {
                if(err)
                    this._error = true;
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
                if(err)
                    this._error = true;
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


    get error() {
        return this._error;
    }
}


module.exports.start = Control



