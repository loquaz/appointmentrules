"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var appointment_1 = require("../model/appointment");
var inversify_1 = require("inversify");
require("reflect-metadata");
var interval_1 = require("../model/interval");
var appointmentType_1 = require("../common/appointmentType");
var base_error_1 = require("../common/base-error");
var application_error_1 = require("../common/application-error");
var AppointmentService = /** @class */ (function () {
    function AppointmentService(repository) {
        this._repo = repository;
    }
    AppointmentService.prototype.setError = function (error) {
        this._error = error;
    };
    AppointmentService.prototype.getError = function () {
        return this._error;
    };
    /**
     * Builds an appointment object from data
     *
     * @param data
     */
    AppointmentService.prototype.build = function (data) {
        var appointment = new appointment_1.default();
        appointment.type = data['type'] || null;
        appointment.dayDate = data['day'] || null;
        appointment.dayNames = data['days'] || null;
        appointment.intervals = this.buildIntervals(data['intervals']);
        return appointment;
    };
    /**
     * Builds a collection of Interval objects from raw data
     *
     * @param data
     */
    AppointmentService.prototype.buildIntervals = function (data) {
        if (!data) {
            return [];
        }
        var _intervals;
        _intervals = data.map(function (_intervalData) {
            return new interval_1.default(_intervalData['start'], _intervalData['end']);
        });
        return _intervals;
    };
    /**
     * Saves an appointment
     *
     * @param appointment
     */
    AppointmentService.prototype.create = function (appointment) {
        // if the appointment already exists 
        // stores only the missing intervals
        if (appointment.type === appointmentType_1.default.DAY) {
            console.log('0000');
            var _day_1 = this._repo.findByDate(appointment.dayDate);
            if (_day_1) {
                var _storedIntervals = _day_1.intervals;
                var _postedIntervals = appointment.intervals;
                var _missingIntervals = this.getMissingIntervals(_postedIntervals, _storedIntervals);
                if (_missingIntervals.length > 0) {
                    // merge the missing interval with the current stored 
                    // to verify if any conflict will occurs
                    _missingIntervals.map(function (interval) {
                        _day_1.intervals.push(interval);
                    });
                    if (!_day_1.validate()) {
                        var error = new base_error_1.default(application_error_1.ErrorTypes.VALIDATION_ERROR, application_error_1.ErrorCodes.VALIDATION_ERROR, _day_1.getError());
                        this.setError(error);
                        return appointment;
                    }
                    else {
                        return this._repo.addIntervalsToDay(_day_1.id, _missingIntervals);
                    }
                }
                else {
                    var error = new base_error_1.default(application_error_1.ErrorTypes.CONFLICT, application_error_1.ErrorCodes.CONFLICT, "Day appointment already exists");
                    this.setError(error);
                    return appointment;
                }
            }
            else {
                return this._repo.save(appointment);
            }
        }
        else if (appointment.type === appointmentType_1.default.DAILY) {
            // if the daily appointment already exists 
            // add only the missing intervals
            var _daily_1 = this._repo.getDaily();
            if (_daily_1) {
                var _storedIntervals = _daily_1.intervals;
                var _postedIntervals = appointment.intervals;
                var _missingIntervals = this.getMissingIntervals(_postedIntervals, _storedIntervals);
                if (_missingIntervals.length > 0) {
                    // merge the missing interval with the current stored 
                    // to verify if any conflict will occurs
                    _missingIntervals.map(function (interval) {
                        _daily_1.intervals.push(interval);
                    });
                    if (!_daily_1.validate()) {
                        var error = new base_error_1.default(application_error_1.ErrorTypes.VALIDATION_ERROR, application_error_1.ErrorCodes.VALIDATION_ERROR, _daily_1.getError());
                        this.setError(error);
                        return appointment;
                    }
                    else {
                        return this._repo.addIntervalsToDaily(_missingIntervals);
                    }
                }
                else {
                    var error = new base_error_1.default(application_error_1.ErrorTypes.CONFLICT, application_error_1.ErrorCodes.CONFLICT, "Daily appointment already exists");
                    this.setError(error);
                    return appointment;
                }
            }
            else {
                return this._repo.save(appointment);
            }
        }
        else if (appointment.type === appointmentType_1.default.WEEKLY) {
            var _weekly_1 = this._repo.getWeekly();
            if (_weekly_1) {
                var _storedIntervals = _weekly_1.intervals;
                var _postedIntervals = appointment.intervals;
                var _storedDays = _weekly_1.dayNames;
                var _postedDays = appointment.dayNames;
                var _missingIntervals = this.getMissingIntervals(_postedIntervals, _storedIntervals);
                var _missingDays = this.getMissingDays(_postedDays, _storedDays);
                if (_missingDays.length === 0 && _missingIntervals.length === 0) {
                    var error = new base_error_1.default(application_error_1.ErrorTypes.CONFLICT, application_error_1.ErrorCodes.CONFLICT, "Weekly appointment already exists");
                    this.setError(error);
                    return appointment;
                }
                else {
                    var _appointment = void 0;
                    if (_missingDays.length > 0) {
                        _appointment = this._repo.addDaysToWeekly(_missingDays);
                    }
                    if (_missingIntervals.length > 0) {
                        // merge the missing interval with the current stored 
                        // to verify if any conflict will occurs
                        _missingIntervals.map(function (interval) {
                            _weekly_1.intervals.push(interval);
                        });
                        if (!_weekly_1.validate()) {
                            var error = new base_error_1.default(application_error_1.ErrorTypes.VALIDATION_ERROR, application_error_1.ErrorCodes.VALIDATION_ERROR, _weekly_1.getError());
                            this.setError(error);
                            return _appointment;
                        }
                        else {
                            _appointment = this._repo.addIntervalsToWeekly(_missingIntervals);
                        }
                    }
                    return _appointment;
                }
            }
            else {
                return this._repo.save(appointment);
            }
        }
        // if we reach this point a wrong type was sent 
        return null;
    };
    AppointmentService.prototype.deleteDayById = function (id, type) {
        return this._repo.deleteById(id, type);
    };
    AppointmentService.prototype.getMissingIntervals = function (posted, stored) {
        var _missingIntervals = [];
        var _tmpPostedInterval;
        var _missing = true;
        for (var i = 0; i < posted.length; i++) {
            _tmpPostedInterval = posted[i].toString();
            for (var j = 0; j < stored.length; j++) {
                if (_tmpPostedInterval === stored[j].toString()) {
                    _missing = false;
                    break;
                }
            }
            if (_missing) {
                _missingIntervals.push(posted[i]);
            }
            _missing = true;
        }
        return _missingIntervals;
    };
    AppointmentService.prototype.getMissingDays = function (posted, stored) {
        var _missingDays = [];
        var _tmpPostedDay;
        var _missing = true;
        for (var i = 0; i < posted.length; i++) {
            _tmpPostedDay = posted[i];
            for (var j = 0; j < stored.length; j++) {
                if (_tmpPostedDay === stored[j]) {
                    _missing = false;
                    break;
                }
            }
            if (_missing) {
                _missingDays.push(posted[i]);
            }
            _missing = true;
        }
        return _missingDays;
    };
    AppointmentService.prototype.getAllDays = function () {
        return this._repo.findAll(appointmentType_1.default.DAY);
    };
    AppointmentService.prototype.getDaily = function () {
        return this._repo.findAll(appointmentType_1.default.DAILY);
    };
    AppointmentService.prototype.getWeekly = function () {
        return this._repo.findAll(appointmentType_1.default.WEEKLY);
    };
    AppointmentService.prototype.getAppointmentsBetween = function (initDate, endDate) {
        return this._repo.getAppointmentsBetween(initDate, endDate);
    };
    AppointmentService = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject("AppointmentRepository")),
        __metadata("design:paramtypes", [Object])
    ], AppointmentService);
    return AppointmentService;
}());
exports.default = AppointmentService;
//# sourceMappingURL=appointment-service.js.map