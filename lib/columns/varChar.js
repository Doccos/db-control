let main = require("./mainColumn");
class VarChar extends main {
    constructor(name, length, isNullAllowed, defaultVal, isUnsigned, isPrimaryKey) {
        super("varchar", name, length, isNullAllowed, defaultVal, isUnsigned, isPrimaryKey);
    }
}

module.exports = VarChar;