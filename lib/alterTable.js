let builder = require("./builder")

class AlterTable {
    constructor(newTable, dbTable, dbName, queryPool) {
        this._newTable = newTable;
        this._dbTable = dbTable;
        this._dbName = dbName;
        this._querys = {keys: [], changeColumn: [], deleteColumn: [], addColumn: []}
        this._queryPool = queryPool;
        this._PrimerKeyPool = [];
        this._PrimeryKeyRebuild = false;

    }

    alter() {
        this._checkForChanges();
        this._checkForDeletedColumns();
        this._checkForNewColumns();
        this._checkForPrimeryKey();
        //return this._querys
    }
    _checkForPrimeryKey() {


        if(this._PrimeryKeyRebuild){
            let query = 'ALTER TABLE `'+this._dbName+'`.`'+this._newTable.tableName+'` DROP PRIMARY KEY, ADD PRIMARY KEY (`'+this._PrimerKeyPool.join('`,`')+'`)';
            this._queryPool.alterKeyColumn.push({query:query});
        }
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
                //if(dbColumn.isPrimaryKey)
                    //this._PrimerkeyRebuild = true;
               // this._querys.deleteColumn.push({query: query});
                this._queryPool.alterDeleteColumn.push({query:query});

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
                if(column.isPrimaryKey){
                    this._PrimeryKeyRebuild = true;
                    this._PrimerKeyPool.push(column.name);
                }

                //this._querys.addColumn.push({query: query});
                this._queryPool.alterAddColumn.push({query:query});
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
        if (column.defaultVal !== dbColumn.defaultVal && column.defaultVal !== null)
            isEqual = false;
        if (column.isAutoIncrement !== dbColumn.isAutoIncrement)
            isEqual = false;
        if(column.isPrimaryKey)
            this._PrimerKeyPool.push(column.name);

        if(column.isPrimaryKey !== dbColumn.isPrimaryKey)
            this._PrimeryKeyRebuild = true;



        if (!isEqual) {
            let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._newTable.tableName + '` CHANGE COLUMN `' + dbColumn.name + '`';

            query += builder.column(column)
            // this._querys.changeColumn.push({query: query});
            this._queryPool.alterChangeColumn.push({query:query});
        }

        if(column.defaultVal === null && dbColumn.defaultVal !== null){
            let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._newTable.tableName + '` ALTER `' + dbColumn.name + '` DROP DEFAULT';
            this._queryPool.alterChangeColumn.push({query:query});

        }

    }
}

module.exports = AlterTable;