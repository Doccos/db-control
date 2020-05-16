'use strict'

let builder = require("./builder")
let relations = require("./relations")
class AlterTable {
    constructor(newTable, dbTable, dbName, queryPool, availableKeys, availalbeRelations) {
        this._newTable = newTable;
        this._dbTable = dbTable;
        this._dbName = dbName;
        this._querys = {keys: [], changeColumn: [], deleteColumn: [], addColumn: []}
        this._queryPool = queryPool;
        this._PrimerKeyPool = [];
        this._PrimeryKeyRebuild = false;
        this._availablelKeys = availableKeys;
        this._availableRelations = availalbeRelations;

    }

    alter() {
        this._checkForChanges();
        this._checkForDeletedColumns();
        this._checkForNewColumns();
        this._checkForPrimeryKey();
        this._checkForOtherKeys();
        //return this._querys
    }

    _checkForPrimeryKey() {
        // console.log(this._availablelKeys.table2);
        if (this._availablelKeys[this._newTable.tableName] && this._availablelKeys[this._newTable.tableName].primaryKey && this._availablelKeys[this._newTable.tableName].primaryKey.length == 0 && this._newTable.keys.primaryKey.length > 0) {
            let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._newTable.tableName + '` ADD PRIMARY KEY(`'
            for (let keys of this._newTable.keys.primaryKey) {
                // console.log(keys);
                query += keys.keys.join('`,`')
            }
            query += '`)';
            this._queryPool.alterKeyColumn.push({query: query});

        } else if (this._availablelKeys[this._newTable.tableName] && this._availablelKeys[this._newTable.tableName].primaryKey && this._availablelKeys[this._newTable.tableName].primaryKey.length > 0 && this._newTable.keys.primaryKey.length === 0) {
            let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._newTable.tableName + '` DROP PRIMARY KEY';
            this._queryPool.alterKeyColumn.push({query: query});

        } else if (this._availablelKeys[this._newTable.tableName] && this._availablelKeys[this._newTable.tableName].primaryKey && this._availablelKeys[this._newTable.tableName].primaryKey.length > 0 && this._newTable.keys.primaryKey.length > 0) {
            let allFound = true;

            for (let keys of this._newTable.keys.primaryKey) {
                for (let key of keys.keys) {
                    let found = false;
                    for (let aKeys of this._availablelKeys[this._newTable.tableName].primaryKey) {
                        for (let aKey of aKeys.keys) {
                            if (aKey === key)
                                found = true;
                        }
                    }

                    if (!found)
                        allFound = false;
                }
            }
            if (allFound) {
                for (let aKeys of this._availablelKeys[this._newTable.tableName].primaryKey) {
                    for (let aKey of aKeys.keys) {
                        let found = false;
                        for (let keys of this._newTable.keys.primaryKey) {
                            for (let key of keys.keys) {
                                if (aKey === key)
                                    found = true;
                            }
                        }
                        if (!found)
                            allFound = false;
                    }
                }
            }
            if (!allFound) {
                let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._newTable.tableName + '`DROP PRIMARY KEY, ADD PRIMARY KEY(`'
                for (let keys of this._newTable.keys.primaryKey) {
                    // console.log(keys);
                    query += keys.keys.join('`,`')
                }
                query += '`)';
                this._queryPool.alterKeyColumn.push({query: query});
            }

        }

        // console.log(this._availablelKeys);
        // if (this._PrimeryKeyRebuild) {
        //     let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._newTable.tableName + '` DROP PRIMARY KEY, ADD PRIMARY KEY (`' + this._PrimerKeyPool.join('`,`') + '`)';
        //     // this._queryPool.alterKeyColumn.push({query:query});
        // }
    }
    _checkForOtherKeys(){
        let trans = {fulltextKey:'FULLTEXT KEY', uniqueKey:'UNIQUE KEY', key:'KEY'}
        for(let keyType of ['uniqueKey', 'fulltextKey', 'key'])
        {
            if(this._availablelKeys[this._newTable.tableName] && this._availablelKeys[this._newTable.tableName][keyType] && this._availablelKeys[this._newTable.tableName][keyType].length > 0 && this._newTable.keys[keyType].length > 0) {
                //Look if available tables in new tables
                for(let aKey of this._availablelKeys[this._newTable.tableName][keyType]){
                    // console.log(aKey, keyType);
                    let found = false;
                    for(let key of this._newTable.keys[keyType]) {
                        if(aKey.keyName === key.keyName) {
                            found = true;
                        }
                    }
                    if(!found){
                        let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._newTable.tableName + '` DROP KEY `'+aKey.keyName+'`';
                        this._queryPool.alterKeyColumn.push({query: query});
                    }
                }
                //check if we need to create new keys
                for(let key of this._newTable.keys[keyType]){
                    let found = false;
                    for(let aKey of this._availablelKeys[this._newTable.tableName][keyType]){
                        if(aKey.keyName === key.keyName)
                            found = true;
                    }
                    if(!found){
                        let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._newTable.tableName + '` ADD '+trans[keyType]+' `'+key.keyName+'` (`' + key.keys.join('`,`') + '`)';
                        this._queryPool.alterKeyColumn.push({query: query});
                    }

                }
                //check if key is changed
                for(let key of this._newTable.keys[keyType]){
                    let allFound = true;
                    for(let aKey of this._availablelKeys[this._newTable.tableName][keyType]){
                        if(aKey.keyName === key.keyName){

                           for(let col of key.keys){
                               let found = false;
                               for(let aCol of aKey.keys) {
                                   if(col === aCol)
                                       found = true;
                               }
                               if(!found)
                                   allFound = false;
                           }
                            for(let aCol of aKey.keys){
                                let found = false;
                                for(let col of key.keys) {
                                    if(col === aCol)
                                        found = true;
                                }
                                if(!found)
                                    allFound = false;
                            }

                        }
                    }
                    if(!allFound){
                        let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._newTable.tableName + '` DROP KEY `'+key.keyName+'`, ADD '+trans[keyType]+' `'+key.keyName+'` (`' + key.keys.join('`,`') + '`)';
                        this._queryPool.alterKeyColumn.push({query: query});
                    }

                }

            } else if(this._availablelKeys[this._newTable.tableName] && this._availablelKeys[this._newTable.tableName][keyType] && this._availablelKeys[this._newTable.tableName][keyType].length === 0 && this._newTable.keys[keyType].length > 0){
                for(let key of this._newTable.keys[keyType]) {
                    let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._newTable.tableName + '` ADD '+trans[keyType]+' `'+key.keyName+'` (`' + key.keys.join('`,`') + '`)';
                    this._queryPool.alterKeyColumn.push({query: query});
                }
            } else if(this._availablelKeys[this._newTable.tableName] && this._availablelKeys[this._newTable.tableName][keyType] && this._availablelKeys[this._newTable.tableName][keyType].length >0 && this._newTable.keys[keyType].length === 0) {
                for(let key of this._availablelKeys[this._newTable.tableName][keyType]) {
                    let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._newTable.tableName + '` DROP KEY `'+key.keyName+'`';
                    this._queryPool.alterKeyColumn.push({query: query});

                }
            }
        }
    }
    _checkKey(key, aKey, keyDesc) {
        //

    }
    _checkForDeletedColumns() {
        for (let dbColumn of this._dbTable.columns) {
            let available = false;
            for (let column of this._newTable.columns) {
                if (column.name === dbColumn.name)
                    available = true;
            }

            if (!available) {
                let rel = relations.checkIfIsARelation(this._availableRelations, this._newTable.tableName, dbColumn.name);
                if(rel){
                    this._queryPool.alterDeleteColumn.push({query: relations.dropRelation(this._dbName,  rel)});
                    for(let pos in this._availableRelations[rel.tableName]){
                        if(this._availableRelations[rel.tableName][pos].keyName === rel.keyName)
                            this._availableRelations[rel.tableName].splice(pos, 1)
                    }
                }


                let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._newTable.tableName + '` DROP COLUMN `' + dbColumn.name + '`'
                //if(dbColumn.isPrimaryKey)
                //this._PrimerkeyRebuild = true;
                // this._querys.deleteColumn.push({query: query});
                this._queryPool.alterDeleteColumn.push({query: query});

            }

        }
    }

    _checkForNewColumns() {
        for (let column of this._newTable.columns) {
            let available = false;

            for (let dbColumn of this._dbTable.columns) {

                if (column.name === dbColumn.name)
                    available = true;
            }
            if (!available) {
                let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._newTable.tableName + '` ADD COLUMN '
                query += builder.column(column)
                if(column.isAutoIncrement) {
                    let queryAI = 'ALTER TABLE `' + this._dbName + '`.`' + this._newTable.tableName + '` CHANGE COLUMN `' + column.name + '`';
                    queryAI += builder.column(column, true)
                    this._queryPool.alterIncrementColumn.push({query: queryAI});

                }

                //this._querys.addColumn.push({query: query});
                this._queryPool.alterAddColumn.push({query: query});
            }

        }
    }

    _checkForChanges() {
        for (let column of this._newTable.columns) {
            for (let dbColumn of this._dbTable.columns) {
                if (column.name == dbColumn.name) {
                    this._compareColumns(column, dbColumn);
                }
            }
        }
    }

    _compareColumns(column, dbColumn) {
        let isEqual = true;
        if (column.typ !== dbColumn.typ)
            isEqual = false;
        if (column.length != dbColumn.length)
            isEqual = false;
        if (column.isUnsigned != dbColumn.isUnsigned)
            isEqual = false;
        if (column.zerofill != dbColumn.zerofill)
            isEqual = false;
        if (column.defaultVal != dbColumn.defaultVal && column.defaultVal !== null)
            isEqual = false;
        // console.log(column,dbColumn.defaultVal);
        if (column.isPrimaryKey)
            this._PrimerKeyPool.push(column.name);

        if(column.isAutoIncrement && column.isAutoIncrement !== dbColumn.isAutoIncrement) {
            let rel = relations.checkIfIsARelation(this._availableRelations, this._newTable.tableName, column.name);
            if(rel)
                this._queryPool.alterIncrementColumn.push({query: relations.dropRelation(this._dbName,  rel)});
            let queryAI = 'ALTER TABLE `' + this._dbName + '`.`' + this._newTable.tableName + '` CHANGE COLUMN `' + column.name + '`';
            queryAI += builder.column(column, true)
            this._queryPool.alterIncrementColumn.push({query: queryAI});
            if(rel)
                this._queryPool.alterIncrementColumn.push({query: relations.addRelation(this._dbName, rel)});
        }

        if (!isEqual) {
           // console.log(column.isUnsigned ,dbColumn.isUnsigned);
            let rel = relations.checkIfIsARelation(this._availableRelations, this._newTable.tableName, dbColumn.name);
            if(rel)
                this._queryPool.alterChangeColumn.push({query: relations.dropRelation(this._dbName,  rel)});

            let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._newTable.tableName + '` CHANGE COLUMN `' + dbColumn.name + '`';

            query += builder.column(column)
            // this._querys.changeColumn.push({query: query});
            this._queryPool.alterChangeColumn.push({query: query});

            if(rel)
                this._queryPool.alterChangeColumn.push({query: relations.addRelation(this._dbName,  rel)});
        }
        // console.log('column', column.defaultVal,'dbcolumn', dbColumn.defaultVal );
        if (column.defaultVal === null && dbColumn.defaultVal !== null) {
            let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._newTable.tableName + '` ALTER `' + dbColumn.name + '` DROP DEFAULT';
            this._queryPool.alterChangeColumn.push({query: query});

        }

    }
}

module.exports = AlterTable;