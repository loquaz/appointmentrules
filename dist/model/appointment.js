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
var appointmentType_1 = require("../appointmentType");
var moment = require("moment");
var base_model_1 = require("./base-model");
var Appointment = /** @class */ (function (_super) {
    __extends(Appointment, _super);
    function Appointment() {
        return _super.call(this) || this;
    }
    Appointment.prototype.validate = function () {
        console.log('appointment.validate()');
        /**
         * The validation depends on the type of appointment
         *
         * if the type is equal to:
         *
         * AppointmentType.DAY: then properties <dayDate> and <intervals> are both required
         * AppointmentType.DAILY: then only property <intervals> are required
         * AppointmentType.WEEKLY: then only properties  <dayNames> and <intervals> are required
         *
         */
        if (this.type === appointmentType_1.default.DAY) {
            var _date = moment(this.dayDate, 'DD-MM-YYYY');
            if (this.dayDate === null || !_date.isValid()) { // validate date
                this.addError("Invalid date", "day", this.dayDate);
                return false;
            }
            else if (this.intervals === null) {
                this.addError("Appointment intervals can\'t be empty", "intervals", null);
                return false;
            }
            else {
                var _intervals = this.intervals;
                for (var i = 0; i < _intervals.length; i++) {
                    if (!_intervals[i].validate()) {
                        this.addError("Invalid interval", "intervals", _intervals[i].toString());
                        return false;
                    }
                } //for
            }
        }
        return true;
    };
    Appointment.prototype.toJson = function () {
        var _obj = {};
        var _intervals = this.intervals.map(function (i) {
            return i.toJson();
        });
        if (this.type === appointmentType_1.default.DAY) {
            _obj = {
                "id": this.id,
                "day": this.dayDate,
                "intervals": _intervals,
            };
        }
        else if (this.type === appointmentType_1.default.DAILY) {
            _obj = {
                "id": this.id,
                "intervals": _intervals
            };
        }
        else if (this.type === appointmentType_1.default.WEEK) {
            _obj = {
                "id": this.id,
                "days": this.dayNames,
                "intervals": _intervals
            };
        }
        return _obj;
    };
    return Appointment;
}(base_model_1.default));
exports.default = Appointment;
//# sourceMappingURL=appointment.js.map