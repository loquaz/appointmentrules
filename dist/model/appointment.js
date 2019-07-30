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
var appointmentType_1 = require("../common/appointmentType");
var moment = require("moment");
var base_model_1 = require("./base-model");
var Appointment = /** @class */ (function (_super) {
    __extends(Appointment, _super);
    function Appointment() {
        return _super.call(this) || this;
    }
    Appointment.prototype.validate = function () {
        /**
         * The validation rules depends on the type of appointment
         *
         * if the type is equal to:
         *
         * AppointmentType.DAY: then, properties <dayDate> and <intervals> are both required
         * AppointmentType.DAILY: then, only property <intervals> is required
         * AppointmentType.WEEKLY: then, only properties  <dayNames> and <intervals> are required
         *
         */
        if (this.type === appointmentType_1.default.DAY) {
            var _date = moment(this.dayDate, 'DD-MM-YYYY');
            if (this.dayDate === null || !_date.isValid()) { // validate date
                this.setError("Invalid date", "day", this.dayDate);
                return false;
            }
        }
        else if (this.type === appointmentType_1.default.WEEKLY) {
            if (this.dayNames === null || this.dayNames.length === 0) { // validate date
                this.setError("Days can\'t be empty", "days", null);
                return false;
            }
        }
        if (this.intervals === null || this.intervals.length === 0) {
            this.setError("Appointment intervals can\'t be empty", "intervals", null);
            return false;
        }
        else {
            var _intervals = this.intervals;
            for (var i = 0; i < _intervals.length; i++) {
                if (!_intervals[i].validate()) {
                    this.setError("Invalid interval", "intervals", _intervals[i].toString());
                    return false;
                }
            } //for
            // search for conflicts
            // sort by start
            var _shToSort = _intervals.map(function (interval, idx) {
                return {
                    "idx": idx,
                    "hour": moment(interval.start, 'HH:mm')
                };
            });
            var _hrAux = void 0;
            for (var i = 0; i < _shToSort.length; i++) {
                for (var j = i + 1; j < _shToSort.length; j++) {
                    if (_shToSort[j]['hour'].isBefore(_shToSort[i]['hour'])) {
                        _hrAux = this.intervals[_shToSort[j]['idx']];
                        this.intervals[_shToSort[j]['idx']] = this.intervals[_shToSort[i]['idx']];
                        this.intervals[_shToSort[i]['idx']] = _hrAux;
                    }
                }
            }
            for (var i = 0; i < this.intervals.length; i++) {
                if ((i + 1) < this.intervals.length) {
                    var _currentEnd = moment(this.intervals[i].end, 'HH:mm');
                    var _nextStart = moment(this.intervals[i + 1].start, 'HH:mm');
                    if (_currentEnd.isSameOrAfter(_nextStart)) {
                        this.setError("Interval conflict", "intervals", _intervals[i].toString() + ' ' + _intervals[i + 1].toString());
                        return false;
                    }
                }
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
        else if (this.type === appointmentType_1.default.WEEKLY) {
            _obj = {
                "id": this.id,
                "days": this.dayNames,
                "intervals": _intervals
            };
        }
        return _obj;
    };
    Appointment.prototype.toJsonWithoutId = function () {
        var _obj = {};
        var _intervals = this.intervals.map(function (i) {
            return i.toJson();
        });
        if (this.type === appointmentType_1.default.DAY) {
            _obj = {
                "day": this.dayDate,
                "intervals": _intervals,
            };
        }
        else if (this.type === appointmentType_1.default.DAILY) {
            _obj = {
                "intervals": _intervals
            };
        }
        else if (this.type === appointmentType_1.default.WEEKLY) {
            _obj = {
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