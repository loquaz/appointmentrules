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
var inversify_1 = require("inversify");
var AppointmentRepository = /** @class */ (function () {
    function AppointmentRepository(ds) {
        this._ds = ds;
    }
    AppointmentRepository.prototype.save = function (model) {
        return this._ds.save(model);
    };
    AppointmentRepository.prototype.findAll = function (type) {
        return this._ds.findAll(type);
    };
    AppointmentRepository.prototype.findByDate = function (date) {
        return this._ds.findByDate(date);
    };
    AppointmentRepository.prototype.deleteById = function (id, type) {
        return this._ds.deleteById(id, type);
    };
    AppointmentRepository.prototype.addIntervalsToDay = function (dayId, intervals) {
        return this._ds.addIntervalsToDay(dayId, intervals);
    };
    AppointmentRepository.prototype.addIntervalsToDaily = function (intervals) {
        return this._ds.addIntervalsToDaily(intervals);
    };
    AppointmentRepository.prototype.addIntervalsToWeekly = function (intervals) {
        return this._ds.addIntervalsToWeekly(intervals);
    };
    AppointmentRepository.prototype.addDaysToWeekly = function (days) {
        return this._ds.addDaysToWeekly(days);
    };
    AppointmentRepository.prototype.getDaily = function () {
        return this._ds.getDaily();
    };
    AppointmentRepository.prototype.getWeekly = function () {
        return this._ds.getWeekly();
    };
    AppointmentRepository.prototype.getAppointmentsBetween = function (initDate, endDate) {
        return this._ds.getAppointmentsBetween(initDate, endDate);
    };
    AppointmentRepository = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject("JsonDatasource")),
        __metadata("design:paramtypes", [Object])
    ], AppointmentRepository);
    return AppointmentRepository;
}());
exports.default = AppointmentRepository;
//# sourceMappingURL=appointment-repository.js.map