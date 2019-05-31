class Relations {
    constructor(table, availableRelations, queryPool, dbName) {
        this._table = table;
        this._availableRelations = availableRelations;
        this._queryPool = queryPool;
        this._dbName = dbName;
    }

    create() {
        this._checkForRelationsToDelete()
        this._checkForRelationsToCreate()
        this._checkForChangedRelations();
    }

    _checkForChangedRelations() {
        for (let relation of this._table.relations) {
            if (this._availableRelations !== undefined)
                for (let aRelation of this._availableRelations) {
                    if (relation.keyName === aRelation.keyName)
                        if (relation.onDelete !== aRelation.onDelete || relation.onUpdate !== aRelation.onUpdate) {
                            let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._table.tableName + '` DROP FOREIGN KEY `' + aRelation.keyName + '`, ADD CONSTRAINT `' + relation.keyName + '` FOREIGN KEY (`' + relation.foreignKey + '`) REFERENCES `' + relation.refTableName + '` (`' + relation.refColumn + '`) ON UPDATE ' + relation.onUpdate + ' ON DELETE ' + relation.onDelete
                            this._queryPool.alterRelations.push({query: query});
                        }
                }
        }
    }

    _checkForRelationsToCreate() {
        for (let relation of this._table.relations) {
            let found = false;
            if (this._availableRelations !== undefined)
                for (let aRelation of this._availableRelations) {
                    if (relation.keyName === aRelation.keyName)
                        found = true;
                }
            if (!found) {
                let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._table.tableName + '` ADD CONSTRAINT `' + relation.keyName + '` FOREIGN KEY (`' + relation.foreignKey + '`) REFERENCES `' + relation.refTableName + '` (`' + relation.refColumn + '`) ON UPDATE ' + relation.onUpdate + ' ON DELETE ' + relation.onDelete
                this._queryPool.alterRelations.push({query: query});
            }
        }

    }

    _checkForRelationsToDelete() {
        if (this._availableRelations !== undefined)
            for (let aRelation of this._availableRelations) {
                let found = false;
                for (let relation of this._table.relations) {
                    if (relation.keyName === aRelation.keyName)
                        found = true;
                }
                if (!found) {
                    let query = 'ALTER TABLE `' + this._dbName + '`.`' + this._table.tableName + '` DROP FOREIGN KEY `' + aRelation.keyName + '`'
                    this._queryPool.alterRelations.push({query: query});
                }
            }
    }
}


module.exports = Relations;