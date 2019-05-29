let builder = require("./builder")

class AlterTable {
    constructor(newTable, dbTable, dbName) {
        this._newTable = newTable;
        this._dbTable = dbTable;
        this._dbName = dbName;
        this._querys = {keys: [], changeColumn: [], deleteColumn: [], addColumn: []}
    }

    alter() {
        this._checkForChanges();
        this._checkForDeletedColumns();
        this._checkForNewColumns();
        return this._querys
    }

    _checkForDeletedColumns() {
        for (let dbColumn of this._dbTable.columns) {
            let available = false;
            for (let column of this._newTable.columns) {
                if (column.name === dbColumn.name)
                    available = true;
            }

            if (!available) {
                let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._newTable.tableName + '` DROP COLUMN `' + dbColumn.name + '`'
                this._querys.deleteColumn.push({query: query});
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
                this._querys.addColumn.push({query: query});
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
        if (column.defaultVal !== dbColumn.defaultVal)
            isEqual = false;
        if (column.isAutoIncrement !== dbColumn.isAutoIncrement)
            isEqual = false;

        if (!isEqual) {
            let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._newTable.tableName + '` CHANGE COLUMN `' + dbColumn.name + '`';

            query += builder.column(column)
            this._querys.changeColumn.push({query: query});
        }

    }
}

module.exports = AlterTable;