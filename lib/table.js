'use strict'
let modelKey = require("./models/key");
let modelRelation = require("./models/relation");


class Table {
    constructor(tableName) {
        this._columns = [];
        this._tableName = tableName;
        this._keys = {primaryKey: [], uniqueKey: [], fulltextKey: [], key: []};
        this._relations = [];
    }

    addColumn(column) {
        for (let aColumn of this._columns) {
            if (aColumn.name === column.name) {
                this.deleteColumn(column.name);
                break;
            }
        }
        this._columns.push(column);
    }

    deleteColumn(columnName) {
        for (let i in this._columns) {
            if (this._columns[i].name === columnName)
                this._columns.splice(i, 1);

        }
    }

    addPrimeryKey(keys) {
        let keyM = new modelKey(keys)
        this._keys.primaryKey.push(keyM);
    }

    addUniqueKey(keys) {
        let keyM = new modelKey(keys)
        this._keys.uniqueKey.push(keyM);

    }
    addFulltextKey(keys) {
        let keyM = new modelKey(keys)
        this._keys.fulltextKey.push(keyM);
    }
    addKey(keys) {
        let keyM = new modelKey(keys)
        this._keys.key.push(keyM);
    }

    addRelation(foreignKey, refTableName, refColumn, onUpdate, onAction) {
        let r = new modelRelation(this._tableName, foreignKey, refTableName, refColumn, onUpdate, onAction);
        this._relations.push(r);
        let keyM = new modelKey(foreignKey)
        this._keys.key.push(keyM);
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


    get keys() {
        return this._keys;
    }

    get relations() {
        return this._relations;
    }
}


module.exports = Table;