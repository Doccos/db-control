'use strict'

class Key {
    constructor(keys){

        if(typeof keys === 'object')
            this._keys = keys;


        if(typeof  keys === 'string')
            this._keys = [keys];
        // console.log(this._keys);
        this._keyName = 'K_'+this._keys.join('_');

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

}

module.exports = Key;