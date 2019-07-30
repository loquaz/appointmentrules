"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_error_1 = require("./base-error");
var ApplicationError = /** @class */ (function (_super) {
    __extends(ApplicationError, _super);
    function ApplicationError(status, type, code, message) {
        var _this = _super.call(this, type, code, message) || this;
        _this._status = status;
        return _this;
    }
    ApplicationError.prototype.getError = function () {
        return {
            "status": this._status,
            "errorCode": this.getCode(),
            "errorType": this.getType(),
            "errorMessage": this.getMessage()
        };
    };
    ApplicationError.buildFromBaseError = function (error, status) {
        return {
            "status": status,
            "errorCode": error.getCode(),
            "errorType": error.getType(),
            "errorMessage": error.getMessage()
        };
    };
    return ApplicationError;
}(base_error_1.default));
exports.default = ApplicationError;
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes[ErrorCodes["VALIDATION_ERROR"] = 1] = "VALIDATION_ERROR";
    ErrorCodes[ErrorCodes["CONFLICT"] = 2] = "CONFLICT";
    ErrorCodes[ErrorCodes["BAD_REQUEST"] = 3] = "BAD_REQUEST";
    ErrorCodes[ErrorCodes["APPLICAITON_ERROR"] = 4] = "APPLICAITON_ERROR";
    ErrorCodes[ErrorCodes["NOT_FOUND"] = 5] = "NOT_FOUND";
})(ErrorCodes = exports.ErrorCodes || (exports.ErrorCodes = {}));
;
var HttpStatusCodes;
(function (HttpStatusCodes) {
    HttpStatusCodes[HttpStatusCodes["OK"] = 200] = "OK";
    HttpStatusCodes[HttpStatusCodes["CREATED"] = 201] = "CREATED";
    HttpStatusCodes[HttpStatusCodes["NO_CONTENT"] = 204] = "NO_CONTENT";
    HttpStatusCodes[HttpStatusCodes["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatusCodes[HttpStatusCodes["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatusCodes[HttpStatusCodes["CONFLICT"] = 409] = "CONFLICT";
})(HttpStatusCodes = exports.HttpStatusCodes || (exports.HttpStatusCodes = {}));
;
var ErrorTypes;
(function (ErrorTypes) {
    ErrorTypes["VALIDATION_ERROR"] = "Invalid data";
    ErrorTypes["CONFLICT"] = "Resource already exists";
    ErrorTypes["BAD_REQUEST"] = "Request Error";
    ErrorTypes["APPLICAITON_ERROR"] = "Application error";
    ErrorTypes["NOT_FOUND"] = "Resource not found";
})(ErrorTypes = exports.ErrorTypes || (exports.ErrorTypes = {}));
;
//# sourceMappingURL=application-error.js.map