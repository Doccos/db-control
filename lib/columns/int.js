let main = require("./mainColumn");
class Int extends main {
    constructor(length, isNullAllowed, defaultVal, isUnsigned, isPrimaryKey) {
        super("int", length, isNullAllowed, defaultVal, isUnsigned, isPrimaryKey);
    }
}

module.exports = Int;