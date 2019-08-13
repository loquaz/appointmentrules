import IDatasource from "./idatasource";
import * as fs from 'fs';
import { execSync as nodeExec }  from 'child_process';
import { injectable } from "inversify";
import "reflect-metadata";
import * as shortid from 'shortid';
import Appointment from "../model/appointment";
import AppointmentType from "../common/appointmentType";
import * as moment from 'moment';
import Interval from "../model/interval";

@injectable()
class JsonDatasource implements IDatasource<Appointment>{

    private _inMemory; 
    private _storageFile    = __dirname + "/appointments.json";    
    private _fs             = fs;
     
    constructor(){
        try{
            this._inMemory = JSON.parse( this._fs.readFileSync( this._storageFile, 'utf-8' ) );
            //console.log( this._inMemory['appointments'] ); 
        }catch(error){
            console.log(error.message);
        }
    }

    generateId():string{
        return shortid.generate();
    }

    save(model: Appointment) {

        let _collection = this._getCollection( model.type );
        model.id        = this.generateId();

        _collection.push( model.toJson() );
        this._saveCollection(model.type, _collection);

        return model;
    }    

    /**
     * Removes a specific item by id denoted by the type of collection
     * 
     * @param id 
     * @param type 
     */
    deleteById(id: string, type: string) : boolean {
        
        let _collection     = this._getCollection( type );
        let _removed: any   = null;

        for(let i = 0; i < _collection.length; i++){

            if( _collection[i]['id'] !== undefined && _collection[i]['id'] === id ){
                _removed = _collection.splice(i,1) // removes the object
                break;
            }

        }

        if(_removed){

            this._saveCollection( type, _collection );
            return true;

        }

        return false;
        
    }
   
    findAll(type: string) : Appointment[] {
        
        let _collection = this._getCollection( type );

        if( type === AppointmentType.DAY ){
            
            let _sortedAppointmentsData = this._sortDayCollection( _collection );
            let _appointments           = _sortedAppointmentsData.map( data => {

                return this._buildAppointmentFromDayData( data );

            });

            return _appointments; 

        }else if( type === AppointmentType.DAILY ) {

            let _collection = this._getCollection( AppointmentType.DAILY );
            let _data       = _collection[0];

            if(!_data)
                return [];

            let _appointments       = [];
            let _appointment        = new Appointment();
            _appointment.id         = _data['id'];
            _appointment.type       = AppointmentType.DAILY;
            _appointment.intervals  = _data['intervals'].map(interval=>{

                return new Interval( interval['start'], interval['end']);

            });

            _appointments.push( _appointment );
            
            return _appointments;

        } else if( type === AppointmentType.WEEKLY ) {

            let _collection         = this._getCollection( AppointmentType.WEEKLY );
            let _data               = _collection[0];

            if(!_data)
                return [];

            let _appointments       = [];
            let _appointment        = new Appointment();
            _appointment.id         = _data['id'];
            _appointment.type       = AppointmentType.WEEKLY;
            _appointment.dayNames   = _data['days'];
            _appointment.intervals  = _data['intervals'].map(interval=>{

                return new Interval( interval['start'], interval['end']);

            });
            
            _appointments.push( _appointment );
            
            return _appointments;

        }

        return [];

    }

    findByDate(date: string): Appointment{
        
        let _collection         = this._getCollection( AppointmentType.DAY );
        let _day: Appointment   = null;
        
        for( let i = 0 ; i < _collection.length ; i++ ){

            if( date === _collection[i]['day'] ){
                
                _day = this._buildAppointmentFromDayData( _collection[i] );
                break; 
            }

        }
        
        return _day;
    }

    _getCollection( type: string ) : Object[] {
        
        let _collection;

        switch(type){
            
            case( AppointmentType.DAY ) :
                _collection = this._inMemory['appointments']['days']; break;
            case ( AppointmentType.DAILY ) :
                _collection = this._inMemory['appointments']['daily']; break;
            case ( AppointmentType.WEEKLY ) :
                _collection = this._inMemory['appointments']['weekly']; break;
            default: 
                _collection = []; break;
        }

        return _collection;
    }

    _saveCollection(type: string, collection: Object[]){

        let _saveInFile = true;
        
        switch(type){
            
            case( AppointmentType.DAY ) :
                this._inMemory['appointments']['days'] = this._sortDayCollection(collection); break;
            case( AppointmentType.DAILY ) :
                this._inMemory['appointments']['daily'] = collection; break;
            case( AppointmentType.WEEKLY ) :
                this._inMemory['appointments']['weekly'] = collection; break;
            default:
                _saveInFile = false; break;

        }

        if(_saveInFile){

            // console.log( 'saveInFile' );
            let _fd = this._fs.openSync(this._storageFile, 'w+');
            this._fs.writeSync( _fd, JSON.stringify( this._inMemory ) );
            
        }

    }

    _sortDayCollection( collection ): Object[] {

        let _sortedCollection   = [];
        let _sortedIds          = [];
        let _daysToSort         = collection.map( d =>{
            
            return {
                "id" : d['id'],
                "day": moment(d['day'], 'DD-MM-YYYY')
            }
        });

        let _dtAux;

        for( let i = 0; i < _daysToSort.length; i++ ){
            for( let j = i+1; j < _daysToSort.length; j++ ){
                
                if( _daysToSort[j]['day'].isBefore( _daysToSort[i]['day'] ) ){

                    _dtAux          = _daysToSort[j];
                    _daysToSort[j]  = _daysToSort[i];
                    _daysToSort[i]  = _dtAux;

                }

            }
        }

        _sortedIds = _daysToSort.map( d => {
            return d['id'];
        });

        _sortedCollection = _sortedIds.map( id => {
            
            for( let i = 0; i < collection.length; i++ ){

                if( id === collection[i]['id'] ){

                    return collection[i];
                    
                }

            }

        });

        return _sortedCollection ;

    }

    _buildAppointmentFromDayData( data: Object ) : Appointment {
        
        let _appointment        = new Appointment();
        _appointment.type       = AppointmentType.DAY;
        _appointment.id         = data['id'];
        _appointment.dayDate    = data['day'];
        _appointment.intervals  = data['intervals'].map( i =>{

            return new Interval(i['start'], i['end']);

        });

        return _appointment;

    }

    addIntervalsToDay( dayId: string, intervals: Interval[] ): Appointment{

        let _day = this.findDayById( dayId );

        if( _day !== null ){

            intervals.map( i =>{
                _day.intervals.push( i.toJson() );
            });

            this._updateDay( dayId, _day );
            return this._buildAppointmentFromDayData( _day );

        }
        return null;
    }
    
    addIntervalsToDaily(intervals: Interval[]): Appointment{

        let _collection = this._getCollection( AppointmentType.DAILY );
        let _data       = _collection[0];
        intervals.map( i =>{
            _data['intervals'].push( i.toJson() );
        });

        // save updates
        _collection[0] = _data;
        this._saveCollection( AppointmentType.DAILY, _collection );

        let _appointment        = new Appointment();
        _appointment.type       = AppointmentType.DAILY;
        _appointment.id         = _data['id'];
        _appointment.intervals  = _data['intervals'].map(interval=>{
            return new Interval( interval['start'], interval['end'] );
        });

        return _appointment;
    }

    addIntervalsToWeekly(intervals: Interval[]): Appointment{

        let _collection = this._getCollection( AppointmentType.WEEKLY );
        let _data       = _collection[0];

        if(!_data)
            return null;

        intervals.map( i =>{
            _data['intervals'].push( i.toJson() );
        });

        // save updates
        _collection[0] = _data;
        this._saveCollection( AppointmentType.WEEKLY, _collection );

        let _appointment        = new Appointment();
        _appointment.type       = AppointmentType.WEEKLY;
        _appointment.id         = _data['id'];
        _appointment.dayNames   = _data['days'];
        _appointment.intervals  = _data['intervals'].map(interval=>{
            return new Interval( interval['start'], interval['end'] );
        });

        return _appointment;
    }

    addDaysToWeekly(days: string[]) : Appointment {

        let _collection     = this._getCollection( AppointmentType.WEEKLY );
        let _data           = _collection[0];
        let _daysCollection = _data['days'] || null;  

        if(!_daysCollection)
            return null;

        days.map( day => {
            _daysCollection.push( day );
        });

        _data['days']   = _daysCollection;
        _collection[0]  = _data;
        this._saveCollection( AppointmentType.WEEKLY, _collection );
        
        let _appointment        = new Appointment();
        _appointment.type       = AppointmentType.WEEKLY;
        _appointment.id         = _data['id'];
        _appointment.dayNames   = _data['days'];
        _appointment.intervals  = _data['intervals'].map(interval=>{
            return new Interval( interval['start'], interval['end'] );
        });

        return _appointment;
    }

    findDayById(id: string) {

        let _collection = this._getCollection( AppointmentType.DAY );
        let _day        = null;

        for( let i = 0 ; i < _collection.length ; i++ ){

            if( id === _collection[i]['id'] ){
                
                _day = _collection[i];
                break;

            }
        }

        return _day;

    }

    _updateDay(dayId: string, day: Object){

        let _collection = this._getCollection( AppointmentType.DAY ); 

        for( let i = 0 ; i < _collection.length ; i++ ){

            if( dayId === _collection[i]['id'] ){

                _collection[i] = day;

            }
        }

        this._saveCollection( AppointmentType.DAY, _collection );

    }

    getDaily() : Appointment { 

        let _collection = this._getCollection( AppointmentType.DAILY );
        let _data       = _collection[0];
        
        if(!_data) 
            return null;

        let _appointment        = new Appointment();
        _appointment.type       = AppointmentType.DAILY;
        _appointment.id         = _data['id']; 
        _appointment.intervals  = _data['intervals'].map(interval=>{
            return new Interval( interval['start'], interval['end'] );
        });
        return _appointment;
    }

    getWeekly() : Appointment {

        let _collection = this._getCollection( AppointmentType.WEEKLY );
        let _data       = _collection[0];
        
        if(!_data) 
            return null;

        let _appointment        = new Appointment();
        _appointment.type       = AppointmentType.WEEKLY;
        _appointment.id         = _data['id'];
        _appointment.dayNames   = _data['days']; 
        _appointment.intervals  = _data['intervals'].map(interval=>{
            return new Interval( interval['start'], interval['end'] );
        });
        return _appointment;

    }

    getAppointmentsBetween(initDate: string, endDate: string) : Appointment[] {

        let _initDate                       = moment(initDate, 'DD-MM-YYYY');
        let _endDate                        = moment(endDate, 'DD-MM-YYYY');
        let _appointments: Appointment[]    = []

        let _collection = this._sortDayCollection( this._getCollection( AppointmentType.DAY ) );
        let _initIdx    = -1;
        let _endIdx     = -1;

        for( let i = 0, j = _collection.length - 1 ; i <= j ; i++, j-- ){

            let _dtIni = moment( _collection[i]['day'], 'DD-MM-YYYY' );
            let _dtEnd = moment( _collection[j]['day'], 'DD-MM-YYYY' );

            if( _initIdx === -1 ){
                if( _dtIni.isSameOrAfter( _initDate ) ){
                    _initIdx = i;
                    //continue;
                }
            }
            
            if( _endIdx === -1 ){
                if( _dtEnd.isSameOrBefore( _endDate ) )
                    _endIdx = j;
            }

        }//for

        if( _initIdx === -1 ){

            return null;

        }

        if( _endIdx === -1 ){

            _endIdx = _collection.length - 1;

        }

        for( let i = _initIdx; i <= _endIdx; i++ ){

            _appointments.push( this._buildAppointmentFromDayData( _collection[i] ) );

        }

        //console.log( 'initIdx', _initIdx,'endtIdx', _endIdx, );

        return _appointments;
    }

}

export default JsonDatasource;