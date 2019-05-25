let main = require("./mainColumn");
class VarChar extends main {
    constructor(length, isNullAllowed, defaultVal, isUnsigned, isPrimaryKey) {
        super("varchar", length, isNullAllowed, defaultVal, isUnsigned, isPrimaryKey);
    }
}

module.exports = VarChar;