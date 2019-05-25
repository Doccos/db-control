class MainColumn {
    constructor(typ, length, isNullAllowed, defaultVal, isUnsigned, isPrimaryKey) {
        this.typ = typ;
        this.length = length;
        this.isNullAllowed = isNullAllowed;
        this.defaultVal = defaultVal;
        this.isUnsigned = isUnsigned;
        this.isPrimaryKey = isPrimaryKey;
    }

}

module.exports = MainColumn;