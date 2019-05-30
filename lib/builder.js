class Builder {
    static column (column) {
        let query = ' `' + column.name + '` ' + column.typ.toUpperCase();

        if (column.length !== null)
            query += '(' + column.length + ')';

        if (column.isUnsigned)
            query += ' UNSIGNED'

        if (column.zerofill)
            query += ' ZEROFILL'
        if(column.isNullAllowed)
            query += ' NULL'
        else
            query += ' NOT NULL'




        if(column.currentTS)
            query += ' DEFAULT CURRENT_TIMESTAMP'
        else if (column.isAutoIncrement)
            query += ' AUTO_INCREMENT'
        else if (column.defaultVal !== null)
            query += '';
        else if (column.defaultVal === 'NULL')
            query += ' DEFAULT NULL'
        else
            query += ' DEFAULT \'' + column.defaultVal + '\''

        if(column.onUpdCurTS && column.defaultVal !== null || column.onUpdCurTS && column.currentTS){
            query += ' ON UPDATE CURRENT_TIMESTAMP';
        }

        return query;
    }
}



module.exports = Builder;