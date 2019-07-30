"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RequestError = /** @class */ (function () {
    function RequestError(statusCode, field, originalValue, message) {
        this._statusCode = statusCode;
        this._field = field;
        this._originalValue = originalValue;
        this._message = message;
    }
    RequestError.prototype.getError = function () {
        return [{
                "statusCode": this._statusCode,
                "field": this._field,
                "originalValue": this._originalValue,
                "message": this._message,
            }];
    };
    return RequestError;
}());
exports.default = RequestError;
//# sourceMappingURL=request-error.js.map