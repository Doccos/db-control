'use strict'

class MainColumn {
    constructor(typ, name, length, isNullAllowed, defaultVal, isUnsigned) {
        this._name = name;
        this._typ = typ;
        this._length = length;
        this._isNullAllowed = isNullAllowed;
        this._defaultVal = defaultVal;
        this._isUnsigned = isUnsigned;
        this._isAutoIncrement = false;
        this._zerofill = false;
        this._extra = ''
        this._onUpdCurTS = false;
        this._currentTS = false;
    }
    set isAutoIncrement(status){
        this._isAutoIncrement = status
    }
    get isAutoIncrement() {
        return this._isAutoIncrement
    }
    set zerofill(status) {
        this._zerofill
    }
    get zerofill() {
        return this._zerofill
    }

    get defaultVal() {
        return this._defaultVal;
    }

    set defaultVal(value) {
        this._defaultVal = value;
    }

    get typ() {
        return this._typ;
    }

    set typ(value) {
        this._typ = value;
    }

    get length() {
        return this._length;
    }

    set length(value) {
        this._length = value;
    }

    get isNullAllowed() {
        return this._isNullAllowed;
    }

    set isNullAllowed(value) {
        this._isNullAllowed = value;
    }

    get isUnsigned() {
        return this._isUnsigned;
    }

    set isUnsigned(value) {
        this._isUnsigned = value;
    }

    get extra() {
        return this._extra;
    }

    set extra(value) {
        this._extra = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get onUpdCurTS() {
        return this._onUpdCurTS;
    }

    set onUpdCurTS(value) {
        this._onUpdCurTS = value;
    }

    get currentTS() {
        return this._currentTS;
    }

    set currentTS(value) {
        this._currentTS = value;
    }
}

module.exports = MainColumn;