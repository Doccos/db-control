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

        if (column.defaultVal !== null && column.defaultVal !== 'auto_increment' && !column.isAutoIncrement)
            if (column.defaultVal === 'NULL')
                query += ' DEFAULT NULL'
            else
                query += ' DEFAULT \'' + column.defaultVal + '\''

        if (column.isAutoIncrement)
            query += ' AUTO_INCREMENT'

        return query;
    }
}



module.exports = Builder;