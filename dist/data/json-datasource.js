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
var appointmentType_1 = require("../appointmentType");
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
        console.log('_collection', _collection);
        return model;
    };
    /**
     * Removes an item from a specific denoted by type collection by id
     *
     * @param id
     * @param type
     */
    JsonDatasource.prototype.deleteById = function (id, type) {
        var _collection = this._getCollection(type);
        var _removed = null;
        console.log(_collection.length);
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
        console.log(_collection.length);
        return false;
    };
    JsonDatasource.prototype.exists = function (model) {
        return false;
    };
    JsonDatasource.prototype.find = function (model) {
        // if the type is day
        var _days = this._inMemory['appointments']['days'];
        var _storedDay;
        //console.log('-----------', _days[0] );
        //console.log( '_days.length', _days.length );
        for (var i = 0; i < _days.length; i++) {
            //console.log('_days[i]');
            if (model.dayDate === _days[i]['dayDate']) {
                //console.log('-->');
                _storedDay = _days[i];
                return _storedDay;
                //console.log( 'JsonDatasource.find()', model);
            }
        }
        ;
        return null;
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
            case (appointmentType_1.default.WEEK):
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
                this._inMemory['appointments']['days'] = collection;
                break;
            case (appointmentType_1.default.DAY):
                this._inMemory['appointments']['daily'] = collection;
                break;
            case (appointmentType_1.default.DAY):
                this._inMemory['appointments']['weekly'] = collection;
                break;
            default:
                _saveInFile = false;
                break;
        }
        if (_saveInFile) {
            var _fd = this._fs.openSync(this._storageFile, 'w+');
            this._fs.writeSync(_fd, JSON.stringify(this._inMemory));
        }
    };
    JsonDatasource = __decorate([
        inversify_1.injectable(),
        __metadata("design:paramtypes", [])
    ], JsonDatasource);
    return JsonDatasource;
}());
exports.default = JsonDatasource;
//# sourceMappingURL=json-datasource.js.map