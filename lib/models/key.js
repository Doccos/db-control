'use strict'

class Key {
    constructor(keys, columns, keyType){
        this._columns = columns;
        this._keys = [];
        this.keyType = keyType || "key";
        if(typeof keys === 'object')
            // this._keys = keys;
            for(let key of keys)
                this._addKey(key);

        if(typeof  keys === 'string')
            this._addKey(keys);
        // console.log(this._keys);
        this._keyName = 'K_'+this._keys.map(key => key.name).join('_');
        this._length = null;

        // console.log(this._columns);
    }
    _addKey(key){
        let parse = key.match(/([a-z0-9-_]*)\(?([0-9]*)?\)?/i);
        key = parse[1];
        let length = parse[2]?parseInt(parse[2]):null;
         // console.log(key, length ,"h");
         // console.log(parse);
        let column = this._columns.find((column)=>{return column.name == key;})

        if(column && column.typ == "varchar" && this.keyType === "key" && length === null && column.length > 191) {
            length = 191;
        }
        // length = length > 191?191:length;
        this._keys.push({name:key, length:length})
    }

    set keyName(value) {
        this._keyName = value;
    }

    get keyName() {
        return this._keyName;
    }

    get keys() {
        return this._keys;
    }

    getKeyString() {
        let tmp = [];
        for(let key of this._keys) {

            if(key.length > 0) {

                tmp.push("`" + key.name + "`("+key.length+")");
            } else {
                tmp.push("`" + key.name + "`");

            }
        }
        return tmp.join(",");
    }
}

module.exports = Key;