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
var AppointmentService = /** @class */ (function () {
    function AppointmentService(repository) {
        this._repo = repository;
    }
    /**
     * Builds an appointment object from data
     *
     * @param data
     */
    AppointmentService.prototype.build = function (data) {
        var appointment = new appointment_1.default();
        appointment.type = data['type'] || null;
        appointment.dayDate = data['day'] || null;
        appointment.dayNames = data['daily'] || null;
        appointment.intervals = this.buildIntervals(data['intervals']);
        //console.log( 'service.build()', appointment  );
        //console.log( 'service.build()', appointment.intervals.toString()  );
        return appointment;
    };
    /**
     * Builds a collection of Interval objects from data
     *
     * @param data
     */
    AppointmentService.prototype.buildIntervals = function (data) {
        var _intervals;
        _intervals = data.map(function (_intervalData) {
            return new interval_1.default(_intervalData['start'], _intervalData['end']);
        });
        return _intervals;
    };
    AppointmentService.prototype.create = function (appointment) {
        // if the appointment already exists 
        return this._repo.save(appointment);
    };
    AppointmentService.prototype.deleteDayById = function (id, type) {
        return this._repo.deleteById(id, type);
    };
    AppointmentService.prototype.exists = function (appointment) {
        return false;
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