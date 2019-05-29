let main = require("./mainColumn");
class Int extends main {
    constructor( name, length, isNullAllowed, defaultVal, isUnsigned, isPrimaryKey, isAutoIncrement) {
        super("int", name, length, isNullAllowed, defaultVal, isUnsigned, isPrimaryKey);
        super.isAutoIncrement = isAutoIncrement;
    }
}

module.exports = Int;