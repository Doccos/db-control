let main = require("./mainColumn");
class Timestamp extends main {
    constructor( name, defaultVal, isPrimaryKey,currentTS, onUpdtCurrTS) {
        super("timestamp", name, null, false, defaultVal, false, isPrimaryKey);
        super.currentTS = currentTS;
        super.onUpdCurTS = onUpdtCurrTS;
    }
}

module.exports = Timestamp;