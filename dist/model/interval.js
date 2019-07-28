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
var base_model_1 = require("./base-model");
var moment = require("moment");
var Interval = /** @class */ (function (_super) {
    __extends(Interval, _super);
    function Interval(start, end) {
        var _this = _super.call(this) || this;
        _this.start = start;
        _this.end = end;
        return _this;
    }
    Interval.prototype.validate = function () {
        var _start = moment(this.start, 'HH:mm');
        var _end = moment(this.end, 'HH:mm');
        if (!_start.isValid() || !_end.isValid()) {
            return false;
        }
        else if (!_start.isBefore(_end)) {
            return false;
        }
        console.log('interval is valid');
        return true;
    };
    Interval.prototype.toString = function () {
        return this.start + "_" + this.end;
    };
    Interval.prototype.toJson = function () {
        return {
            "start": this.start,
            "end": this.end
        };
    };
    return Interval;
}(base_model_1.default));
exports.default = Interval;
//# sourceMappingURL=interval.js.map