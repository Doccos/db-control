'use strict'

class Relation {

    constructor(tableName, foreignKey, refTableName, refColumn, onUpdate, onDelete) {
        this._tableName = tableName;
        this._foreignKey = foreignKey;
        this._refTableName = refTableName;
        this._refColumn = refColumn;
        if(onDelete !== undefined)
            this._onDelete = onDelete;
        else {
            this._onDelete = 'RESTRICT';

        }
        if(onUpdate !== undefined)
            this._onUpdate = onUpdate;
        else {
            this._onUpdate = 'RESTRICT';
        }

        this._refColumn = refColumn;
        this._keyName = 'FK_' + this._tableName + '_' + this._foreignKey + '_' + this._refTableName + '_' + this._refColumn;

    }


    get tableName() {
        return this._tableName;
    }

    get foreignKey() {
        return this._foreignKey;
    }

    get refTableName() {
        return this._refTableName;
    }

    get refColumn() {
        return this._refColumn;
    }

    get onUpdate() {
        return this._onUpdate;
    }

    get onDelete() {
        return this._onDelete;
    }

    get keyName() {
        return this._keyName;
    }

    set keyName(value) {
        this._keyName = value;
    }
}

module.exports = Relation;