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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var inversify_1 = require("inversify");
require("reflect-metadata");
var shortid = require("shortid");
var appointment_1 = require("../model/appointment");
var appointmentType_1 = require("../common/appointmentType");
var moment = require("moment");
var interval_1 = require("../model/interval");
var JsonDatasource = /** @class */ (function () {
    function JsonDatasource() {
        this._storageFile = __dirname + "/appointments.json";
        this._fs = fs;
        try {
            this._inMemory = JSON.parse(this._fs.readFileSync(this._storageFile, 'utf-8'));
            //console.log( this._inMemory['appointments'] ); 
        }
        catch (error) {
            console.log(error.message);
        }
    }
    JsonDatasource.prototype.generateId = function () {
        return shortid.generate();
    };
    JsonDatasource.prototype.save = function (model) {
        var _collection = this._getCollection(model.type);
        model.id = this.generateId();
        _collection.push(model.toJson());
        this._saveCollection(model.type, _collection);
        return model;
    };
    /**
     * Removes a specific item by id denoted by the type of collection
     *
     * @param id
     * @param type
     */
    JsonDatasource.prototype.deleteById = function (id, type) {
        var _collection = this._getCollection(type);
        var _removed = null;
        for (var i = 0; i < _collection.length; i++) {
            if (_collection[i]['id'] !== undefined && _collection[i]['id'] === id) {
                _removed = _collection.splice(i, 1); // removes the object
                break;
            }
        }
        if (_removed) {
            this._saveCollection(type, _collection);
            return true;
        }
        return false;
    };
    JsonDatasource.prototype.findAll = function (type) {
        var _this = this;
        var _collection = this._getCollection(type);
        if (type === appointmentType_1.default.DAY) {
            var _sortedAppointmentsData = this._sortDayCollection(_collection);
            var _appointments = _sortedAppointmentsData.map(function (data) {
                return _this._buildAppointmentFromDayData(data);
            });
            return _appointments;
        }
        else if (type === appointmentType_1.default.DAILY) {
            var _collection_1 = this._getCollection(appointmentType_1.default.DAILY);
            var _data = _collection_1[0];
            if (!_data)
                return [];
            var _appointments = [];
            var _appointment = new appointment_1.default();
            _appointment.id = _data['id'];
            _appointment.type = appointmentType_1.default.DAILY;
            _appointment.intervals = _data['intervals'].map(function (interval) {
                return new interval_1.default(interval['start'], interval['end']);
            });
            _appointments.push(_appointment);
            return _appointments;
        }
        else if (type === appointmentType_1.default.WEEKLY) {
            var _collection_2 = this._getCollection(appointmentType_1.default.WEEKLY);
            var _data = _collection_2[0];
            if (!_data)
                return [];
            var _appointments = [];
            var _appointment = new appointment_1.default();
            _appointment.id = _data['id'];
            _appointment.type = appointmentType_1.default.WEEKLY;
            _appointment.dayNames = _data['days'];
            _appointment.intervals = _data['intervals'].map(function (interval) {
                return new interval_1.default(interval['start'], interval['end']);
            });
            _appointments.push(_appointment);
            return _appointments;
        }
        return [];
    };
    JsonDatasource.prototype.findByDate = function (date) {
        var _collection = this._getCollection(appointmentType_1.default.DAY);
        var _day = null;
        for (var i = 0; i < _collection.length; i++) {
            if (date === _collection[i]['day']) {
                _day = this._buildAppointmentFromDayData(_collection[i]);
                break;
            }
        }
        return _day;
    };
    JsonDatasource.prototype._getCollection = function (type) {
        var _collection;
        switch (type) {
            case (appointmentType_1.default.DAY):
                _collection = this._inMemory['appointments']['days'];
                break;
            case (appointmentType_1.default.DAILY):
                _collection = this._inMemory['appointments']['daily'];
                break;
            case (appointmentType_1.default.WEEKLY):
                _collection = this._inMemory['appointments']['weekly'];
                break;
            default:
                _collection = [];
                break;
        }
        return _collection;
    };
    JsonDatasource.prototype._saveCollection = function (type, collection) {
        var _saveInFile = true;
        switch (type) {
            case (appointmentType_1.default.DAY):
                this._inMemory['appointments']['days'] = this._sortDayCollection(collection);
                break;
            case (appointmentType_1.default.DAILY):
                this._inMemory['appointments']['daily'] = collection;
                break;
            case (appointmentType_1.default.WEEKLY):
                this._inMemory['appointments']['weekly'] = collection;
                break;
            default:
                _saveInFile = false;
                break;
        }
        if (_saveInFile) {
            // console.log( 'saveInFile' );
            var _fd = this._fs.openSync(this._storageFile, 'w+');
            this._fs.writeSync(_fd, JSON.stringify(this._inMemory));
        }
    };
    JsonDatasource.prototype._sortDayCollection = function (collection) {
        var _sortedCollection = [];
        var _sortedIds = [];
        var _daysToSort = collection.map(function (d) {
            return {
                "id": d['id'],
                "day": moment(d['day'], 'DD-MM-YYYY')
            };
        });
        var _dtAux;
        for (var i = 0; i < _daysToSort.length; i++) {
            for (var j = i + 1; j < _daysToSort.length; j++) {
                if (_daysToSort[j]['day'].isBefore(_daysToSort[i]['day'])) {
                    _dtAux = _daysToSort[j];
                    _daysToSort[j] = _daysToSort[i];
                    _daysToSort[i] = _dtAux;
                }
            }
        }
        _sortedIds = _daysToSort.map(function (d) {
            return d['id'];
        });
        _sortedCollection = _sortedIds.map(function (id) {
            for (var i = 0; i < collection.length; i++) {
                if (id === collection[i]['id']) {
                    return collection[i];
                }
            }
        });
        return _sortedCollection;
    };
    JsonDatasource.prototype._buildAppointmentFromDayData = function (data) {
        var _appointment = new appointment_1.default();
        _appointment.type = appointmentType_1.default.DAY;
        _appointment.id = data['id'];
        _appointment.dayDate = data['day'];
        _appointment.intervals = data['intervals'].map(function (i) {
            return new interval_1.default(i['start'], i['end']);
        });
        return _appointment;
    };
    JsonDatasource.prototype.addIntervalsToDay = function (dayId, intervals) {
        var _day = this.findDayById(dayId);
        if (_day !== null) {
            intervals.map(function (i) {
                _day.intervals.push(i.toJson());
            });
            this._updateDay(dayId, _day);
            return this._buildAppointmentFromDayData(_day);
        }
        return null;
    };
    JsonDatasource.prototype.addIntervalsToDaily = function (intervals) {
        var _collection = this._getCollection(appointmentType_1.default.DAILY);
        var _data = _collection[0];
        intervals.map(function (i) {
            _data['intervals'].push(i.toJson());
        });
        // save updates
        _collection[0] = _data;
        this._saveCollection(appointmentType_1.default.DAILY, _collection);
        var _appointment = new appointment_1.default();
        _appointment.type = appointmentType_1.default.DAILY;
        _appointment.id = _data['id'];
        _appointment.intervals = _data['intervals'].map(function (interval) {
            return new interval_1.default(interval['start'], interval['end']);
        });
        return _appointment;
    };
    JsonDatasource.prototype.addIntervalsToWeekly = function (intervals) {
        var _collection = this._getCollection(appointmentType_1.default.WEEKLY);
        var _data = _collection[0];
        intervals.map(function (i) {
            _data['intervals'].push(i.toJson());
        });
        // save updates
        _collection[0] = _data;
        this._saveCollection(appointmentType_1.default.WEEKLY, _collection);
        var _appointment = new appointment_1.default();
        _appointment.type = appointmentType_1.default.WEEKLY;
        _appointment.id = _data['id'];
        _appointment.dayNames = _data['days'];
        _appointment.intervals = _data['intervals'].map(function (interval) {
            return new interval_1.default(interval['start'], interval['end']);
        });
        return _appointment;
    };
    JsonDatasource.prototype.addDaysToWeekly = function (days) {
        var _collection = this._getCollection(appointmentType_1.default.WEEKLY);
        var _data = _collection[0];
        var _daysCollection = _data['days'] || null;
        if (!_daysCollection)
            return null;
        days.map(function (day) {
            _daysCollection.push(day);
        });
        _data['days'] = _daysCollection;
        _collection[0] = _data;
        this._saveCollection(appointmentType_1.default.WEEKLY, _collection);
        var _appointment = new appointment_1.default();
        _appointment.type = appointmentType_1.default.WEEKLY;
        _appointment.id = _data['id'];
        _appointment.dayNames = _data['days'];
        _appointment.intervals = _data['intervals'].map(function (interval) {
            return new interval_1.default(interval['start'], interval['end']);
        });
        return _appointment;
    };
    JsonDatasource.prototype.findDayById = function (id) {
        var _collection = this._getCollection(appointmentType_1.default.DAY);
        var _day = null;
        for (var i = 0; i < _collection.length; i++) {
            if (id === _collection[i]['id']) {
                _day = _collection[i];
                break;
            }
        }
        return _day;
    };
    JsonDatasource.prototype._updateDay = function (dayId, day) {
        var _collection = this._getCollection(appointmentType_1.default.DAY);
        for (var i = 0; i < _collection.length; i++) {
            if (dayId === _collection[i]['id']) {
                _collection[i] = day;
            }
        }
        this._saveCollection(appointmentType_1.default.DAY, _collection);
    };
    JsonDatasource.prototype.getDaily = function () {
        var _collection = this._getCollection(appointmentType_1.default.DAILY);
        var _data = _collection[0];
        if (!_data)
            return null;
        var _appointment = new appointment_1.default();
        _appointment.type = appointmentType_1.default.DAILY;
        _appointment.id = _data['id'];
        _appointment.intervals = _data['intervals'].map(function (interval) {
            return new interval_1.default(interval['start'], interval['end']);
        });
        return _appointment;
    };
    JsonDatasource.prototype.getWeekly = function () {
        var _collection = this._getCollection(appointmentType_1.default.WEEKLY);
        var _data = _collection[0];
        if (!_data)
            return null;
        var _appointment = new appointment_1.default();
        _appointment.type = appointmentType_1.default.WEEKLY;
        _appointment.id = _data['id'];
        _appointment.dayNames = _data['days'];
        _appointment.intervals = _data['intervals'].map(function (interval) {
            return new interval_1.default(interval['start'], interval['end']);
        });
        return _appointment;
    };
    JsonDatasource.prototype.getAppointmentsBetween = function (initDate, endDate) {
        var _initDate = moment(initDate, 'DD-MM-YYYY');
        var _endDate = moment(endDate, 'DD-MM-YYYY');
        var _appointments = [];
        var _collection = this._sortDayCollection(this._getCollection(appointmentType_1.default.DAY));
        var _initIdx = -1;
        var _endIdx = -1;
        for (var i = 0, j = _collection.length - 1; i < j; i++, j--) {
            var _dtIni = moment(_collection[i]['day'], 'DD-MM-YYYY');
            var _dtEnd = moment(_collection[j]['day'], 'DD-MM-YYYY');
            if (_initIdx === -1) {
                if (_dtIni.isSameOrAfter(_initDate)) {
                    _initIdx = i;
                    //continue;
                }
            }
            if (_endIdx === -1) {
                if (_dtEnd.isSameOrBefore(_endDate))
                    _endIdx = j;
            }
        } //for
        if (_initIdx === -1) {
            return null;
        }
        if (_endIdx === -1) {
            _endIdx = _collection.length - 1;
        }
        for (var i = _initIdx; i <= _endIdx; i++) {
            _appointments.push(this._buildAppointmentFromDayData(_collection[i]));
        }
        //console.log( 'initIdx', _initIdx,'endtIdx', _endIdx, );
        return _appointments;
    };
    JsonDatasource = __decorate([
        inversify_1.injectable(),
        __metadata("design:paramtypes", [])
    ], JsonDatasource);
    return JsonDatasource;
}());
exports.default = JsonDatasource;
//# sourceMappingURL=json-datasource.js.map