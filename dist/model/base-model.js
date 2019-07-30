"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel = /** @class */ (function () {
    function BaseModel() {
    }
    /**
     * Set an error
     *
     * @param message
     * @param field
     * @param originalValue
     */
    BaseModel.prototype.setError = function (message, field, originalValue) {
        this._error = new ModelError(message, field, originalValue);
    };
    /**
     *  Return the error
     */
    BaseModel.prototype.getError = function () {
        return this._error.toString();
    };
    return BaseModel;
}());
var ModelError = /** @class */ (function () {
    function ModelError(msg, field, value) {
        this._message = msg;
        this._field = field;
        this._originalValue = value;
    }
    ModelError.prototype.toString = function () {
        return this._message + ", {" + this._field + "}, " + this._originalValue;
    };
    return ModelError;
}());
exports.default = BaseModel;
//# sourceMappingURL=base-model.js.map