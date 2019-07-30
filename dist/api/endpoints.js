"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var Router = require("koa-router");
var appointmentType_1 = require("../common/appointmentType");
var moment = require("moment");
var application_error_1 = require("../common/application-error");
var endpoints = new Router();
/*==============================================================
                            DAY
===============================================================*/
/**
 * get all days appointments
 */
endpoints.get('/appointment/days', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var serviceAppointment, appointments, response;
    return __generator(this, function (_a) {
        serviceAppointment = ctx.container.get("AppointmentService");
        appointments = serviceAppointment.getAllDays();
        response = appointments.map(function (appointment) {
            return appointment.toJsonWithoutId();
        });
        ctx.body = response;
        return [2 /*return*/];
    });
}); });
/**
 * registers a day appointment
 */
endpoints.post('/appointment/day', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var appointmentData, serviceAppointment, appointmentRecord, errorMsg, error, errorMsg, error, appointmentSaved, error;
    return __generator(this, function (_a) {
        appointmentData = ctx.request.body;
        serviceAppointment = ctx.container.get("AppointmentService");
        appointmentRecord = serviceAppointment.build(appointmentData);
        if (appointmentRecord.type !== appointmentType_1.default.DAY) {
            errorMsg = "Wrong type specified {" + appointmentRecord.type + "}";
            error = new application_error_1.default(400, application_error_1.ErrorTypes.BAD_REQUEST, application_error_1.ErrorCodes.BAD_REQUEST, errorMsg);
            ctx.status = application_error_1.HttpStatusCodes.BAD_REQUEST;
            ctx.body = error.getError();
        }
        else if (!appointmentRecord.validate()) {
            console.log('endpoint');
            errorMsg = appointmentRecord.getError();
            error = new application_error_1.default(400, application_error_1.ErrorTypes.VALIDATION_ERROR, application_error_1.ErrorCodes.VALIDATION_ERROR, errorMsg);
            ctx.status = application_error_1.HttpStatusCodes.OK;
            ctx.body = error.getError();
        }
        else {
            appointmentSaved = serviceAppointment.create(appointmentRecord);
            if (appointmentSaved && serviceAppointment.getError()) {
                error = application_error_1.default.buildFromBaseError(serviceAppointment.getError(), 400);
                ctx.status = 400; // BAD REQUEST
                ctx.body = error;
            }
            else if (appointmentSaved) {
                ctx.body = appointmentSaved.toJson();
            }
        }
        return [2 /*return*/];
    });
}); });
/**
 * Removes an day appointment
 */
endpoints.del('/appointment/day/:id', function (ctx) {
    var _id = ctx.params.id;
    var serviceAppointment = ctx.container.get("AppointmentService");
    var removed = serviceAppointment.deleteDayById(_id, appointmentType_1.default.DAY);
    if (removed) {
        ctx.status = application_error_1.HttpStatusCodes.NO_CONTENT; // DELETED
    }
    else {
        var errorMsg = "resource with id {" + _id + "} not found";
        var error = new application_error_1.default(404, application_error_1.ErrorTypes.NOT_FOUND, application_error_1.ErrorCodes.NOT_FOUND, errorMsg);
        ctx.status = application_error_1.HttpStatusCodes.NOT_FOUND;
        ctx.body = error.getError();
    }
});
/**
 * Retrieves all appointments between the suplieds init and end dates
 */
endpoints.get('/appointment/available/:initdate/:enddate', function (ctx) {
    var _initDateParam = ctx.params.initdate;
    var _endDateParam = ctx.params.enddate;
    var _initDate = moment(_initDateParam, 'DD-MM-YYYY');
    var _endDate = moment(_endDateParam, 'DD-MM-YYYY');
    if (!_initDate.isValid() || !_endDate.isValid()) {
        var errorMsg = _initDateParam + ", " + _endDateParam + " or both are invalid dates";
        var error = new application_error_1.default(400, application_error_1.ErrorTypes.BAD_REQUEST, application_error_1.ErrorCodes.BAD_REQUEST, errorMsg);
        ctx.status = application_error_1.HttpStatusCodes.OK;
        ctx.body = error.getError();
    }
    else if (_initDate.isAfter(_endDate)) {
        var errorMsg = _initDateParam + " can't be greater than " + _endDateParam;
        var error = new application_error_1.default(400, application_error_1.ErrorTypes.BAD_REQUEST, application_error_1.ErrorCodes.BAD_REQUEST, errorMsg);
        ctx.status = application_error_1.HttpStatusCodes.OK;
        ctx.body = error.getError();
    }
    else {
        var serviceAppointment = ctx.container.get("AppointmentService");
        var appointments = serviceAppointment.getAppointmentsBetween(_initDateParam, _endDateParam);
        var response = [];
        if (appointments && appointments.length > 0) {
            response = appointments.map(function (appointment) {
                return appointment.toJsonWithoutId();
            });
            ctx.body = response;
        }
    }
});
/*==============================================================
                            DAILY
===============================================================*/
/**
 * get daily appointment
 */
endpoints.get('/appointment/daily', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var serviceAppointment, appointments, response;
    return __generator(this, function (_a) {
        serviceAppointment = ctx.container.get("AppointmentService");
        appointments = serviceAppointment.getDaily();
        response = appointments.map(function (appointment) {
            return appointment.toJsonWithoutId();
        });
        ctx.body = response;
        return [2 /*return*/];
    });
}); });
/**
 * registers a daily appointment
 */
endpoints.post('/appointment/daily', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var appointmentData, serviceAppointment, appointmentRecord, errorMsg, error, errorMsg, error, appointmentSaved, error;
    return __generator(this, function (_a) {
        appointmentData = ctx.request.body;
        serviceAppointment = ctx.container.get("AppointmentService");
        appointmentRecord = serviceAppointment.build(appointmentData);
        if (appointmentRecord.type !== appointmentType_1.default.DAILY) {
            errorMsg = "Wrong type specified {" + appointmentRecord.type + "}";
            error = new application_error_1.default(400, application_error_1.ErrorTypes.BAD_REQUEST, application_error_1.ErrorCodes.BAD_REQUEST, errorMsg);
            ctx.status = application_error_1.HttpStatusCodes.BAD_REQUEST;
            ctx.body = error.getError();
        }
        else if (!appointmentRecord.validate()) {
            console.log('endpoint daily');
            errorMsg = appointmentRecord.getError();
            error = new application_error_1.default(400, application_error_1.ErrorTypes.VALIDATION_ERROR, application_error_1.ErrorCodes.VALIDATION_ERROR, errorMsg);
            ctx.status = application_error_1.HttpStatusCodes.OK;
            ctx.body = error.getError();
        }
        else {
            appointmentSaved = serviceAppointment.create(appointmentRecord);
            if (appointmentSaved && serviceAppointment.getError()) {
                error = application_error_1.default.buildFromBaseError(serviceAppointment.getError(), 400);
                ctx.status = 400; // BAD REQUEST
                ctx.body = error;
            }
            else if (appointmentSaved) {
                ctx.body = appointmentSaved.toJson();
            }
        }
        return [2 /*return*/];
    });
}); });
/**
 * Removes an daily appointment
 */
endpoints.del('/appointment/daily/:id', function (ctx) {
    var _id = ctx.params.id;
    var serviceAppointment = ctx.container.get("AppointmentService");
    var removed = serviceAppointment.deleteDayById(_id, appointmentType_1.default.DAILY);
    if (removed) {
        ctx.status = application_error_1.HttpStatusCodes.NO_CONTENT; // DELETED
    }
    else {
        var errorMsg = "resource with id {" + _id + "} not found";
        var error = new application_error_1.default(404, application_error_1.ErrorTypes.NOT_FOUND, application_error_1.ErrorCodes.NOT_FOUND, errorMsg);
        ctx.status = application_error_1.HttpStatusCodes.NOT_FOUND;
        ctx.body = error.getError();
    }
    //console.log('id', ctx.params.id);
});
/*==============================================================
                            WEEKLY
===============================================================*/
/**
 * get weekly appointment
 */
endpoints.get('/appointment/weekly', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var serviceAppointment, appointments, response;
    return __generator(this, function (_a) {
        serviceAppointment = ctx.container.get("AppointmentService");
        appointments = serviceAppointment.getWeekly();
        response = appointments.map(function (appointment) {
            return appointment.toJsonWithoutId();
        });
        ctx.body = response;
        return [2 /*return*/];
    });
}); });
/**
 * registers a weekly appointment
 */
endpoints.post('/appointment/weekly', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    var appointmentData, serviceAppointment, appointmentRecord, errorMsg, error, errorMsg, error, appointmentSaved, error;
    return __generator(this, function (_a) {
        appointmentData = ctx.request.body;
        serviceAppointment = ctx.container.get("AppointmentService");
        appointmentRecord = serviceAppointment.build(appointmentData);
        if (appointmentRecord.type !== appointmentType_1.default.WEEKLY) {
            errorMsg = "Wrong type specified {" + appointmentRecord.type + "}";
            error = new application_error_1.default(400, application_error_1.ErrorTypes.BAD_REQUEST, application_error_1.ErrorCodes.BAD_REQUEST, errorMsg);
            ctx.status = application_error_1.HttpStatusCodes.BAD_REQUEST;
            ctx.body = error.getError();
        }
        else if (!appointmentRecord.validate()) {
            console.log('endpoint weekly');
            errorMsg = appointmentRecord.getError();
            error = new application_error_1.default(400, application_error_1.ErrorTypes.VALIDATION_ERROR, application_error_1.ErrorCodes.VALIDATION_ERROR, errorMsg);
            ctx.status = application_error_1.HttpStatusCodes.OK;
            ctx.body = error.getError();
        }
        else {
            appointmentSaved = serviceAppointment.create(appointmentRecord);
            if (appointmentSaved && serviceAppointment.getError()) {
                error = application_error_1.default.buildFromBaseError(serviceAppointment.getError(), 400);
                ctx.status = 400; // BAD REQUEST
                ctx.body = error;
            }
            else if (appointmentSaved) {
                ctx.body = appointmentSaved.toJson();
            }
        }
        return [2 /*return*/];
    });
}); });
/**
 * Removes an weekly appointment
 */
endpoints.del('/appointment/weekly/:id', function (ctx) {
    var _id = ctx.params.id;
    var serviceAppointment = ctx.container.get("AppointmentService");
    var removed = serviceAppointment.deleteDayById(_id, appointmentType_1.default.WEEKLY);
    if (removed) {
        ctx.status = application_error_1.HttpStatusCodes.NO_CONTENT; // DELETED
    }
    else {
        var errorMsg = "resource with id {" + _id + "} not found";
        var error = new application_error_1.default(404, application_error_1.ErrorTypes.NOT_FOUND, application_error_1.ErrorCodes.NOT_FOUND, errorMsg);
        ctx.status = application_error_1.HttpStatusCodes.NOT_FOUND;
        ctx.body = error.getError();
    }
    //console.log('id', ctx.params.id);
});
exports.default = endpoints;
//# sourceMappingURL=endpoints.js.map