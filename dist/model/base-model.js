"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseModel = /** @class */ (function () {
    function BaseModel() {
        this._errors = [];
    }
    /**
     * Add a model error
     *
     * @param msg
     * @param field
     * @param value
     */
    BaseModel.prototype.addError = function (msg, field, value) {
        console.log(':( erro');
        this._errors.push(new ModelError(msg, field, value));
    };
    /**
     *  Returns all model errors
     *
     */
    BaseModel.prototype.getErrors = function () {
        return this._errors;
    };
    return BaseModel;
}());
var ModelError = /** @class */ (function () {
    function ModelError(msg, field, value) {
        this.message = msg;
        this.field = field;
        this.value = value;
    }
    return ModelError;
}());
exports.default = BaseModel;
//# sourceMappingURL=base-model.js.map