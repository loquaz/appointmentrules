"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseError = /** @class */ (function () {
    function BaseError(type, code, message) {
        this._errorType = type;
        this._errorCode = code;
        this._errorMessage = message;
    }
    BaseError.prototype.getType = function () {
        return this._errorType;
    };
    BaseError.prototype.getCode = function () {
        return this._errorCode;
    };
    BaseError.prototype.getMessage = function () {
        return this._errorMessage;
    };
    return BaseError;
}());
exports.default = BaseError;
//# sourceMappingURL=base-error.js.map