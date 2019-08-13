import Appointment from "../model/appointment";
import IService from './iservice';
import IRepository from '../repository/irepository';
import { inject, injectable } from "inversify";
import "reflect-metadata";
import Interval from "../model/interval";
import AppointmentType from "../common/appointmentType";
import BaseError from "../common/base-error";
import { ErrorTypes, ErrorCodes } from "../common/application-error";
import * as moment from 'moment';

@injectable()
class AppointmentService implements IService<Appointment> {

    private _repo : IRepository<Appointment>;
    private _error: BaseError;

    constructor(@inject("AppointmentRepository") repository: IRepository<Appointment>){

        this._repo = repository;

    }

    setError(error: BaseError){
        this._error = error;
    }

    getError() : BaseError {
        return this._error;
    }
    
    /**
     * Builds an appointment object from data
     * 
     * @param data 
     */
    build(data: Object): Appointment {

        const appointment       = new Appointment();
        appointment.type        = data['type'] || null;
        appointment.dayDate     = data['day'] || null;
        appointment.dayNames    = data['days'] || null;
        appointment.intervals   = this.buildIntervals( data['intervals'] );

        return appointment;

    }

    /**
     * Builds a collection of Interval objects from raw data
     * 
     * @param data 
     */
    buildIntervals(data: any[]) : Interval[] {
        
        if(!data){
            return [];
        }

        let _intervals: Interval[];
        _intervals =  data.map( _intervalData => {

            return new Interval( _intervalData['start'], _intervalData['end'] );

        });

        return _intervals;
    }

    /**
     * Saves an appointment
     * 
     * @param appointment 
     */
    create( appointment: Appointment ): Appointment {
        
        /** BEGIN FINAL REFACTORING **/
        let _errorOccurred  = false;
        let _errorMessage   = '';

        let _storedDay              = this._repo.findByDate( appointment.dayDate );
        let _storedDays             = this._repo.findAll( AppointmentType.DAY );
        let _storedDaily            = this._repo.getDaily();
        let _storedWeekly           = this._repo.getWeekly();
        let _addMissingIntervals    = false;
        
        if( appointment.type === AppointmentType.DAY ) {

            if( _storedDay ) {

                if( !appointment.validateIntervalsAgainst( _storedDay.intervals ) ){
                    
                    _errorOccurred  = true;
                    _errorMessage   = 'Conflict with anoter day rule: ' + appointment.getError();                    
                    
                } else {

                    _addMissingIntervals = true

                } 
            }
                
            if( !_errorOccurred && _storedDaily ) {

                if( !appointment.validateIntervalsAgainst( _storedDaily.intervals ) ) {
                    _errorOccurred  = true;
                    _errorMessage   = 'Conflict with daily rule: ' + appointment.getError();

                }

            }

            if( !_errorOccurred && _storedWeekly ) {

                // tests if the posted day is covered by the weekly rule
                const _postedDayNumber      = moment(appointment.dayDate, 'DD-MM-YYYY').day();
                const _weeklyDayNames       = _storedWeekly.dayNames;
                const _weeklyIntervals      = _storedWeekly.intervals;

                for(let i = 0 ; i < _weeklyDayNames.length ; i++){

                    if(_postedDayNumber === this._getDayNumberFromDayName( _weeklyDayNames[i] ) ){
                                
                        if( !appointment.validateIntervalsAgainst( _weeklyIntervals ) ){
                            _errorOccurred  = true;
                            _errorMessage   = `Conflict with weekly rule for [ ${_weeklyDayNames[i]} ]: ` + appointment.getError();
                            break;
                        }
                    }
                }
            }

            if( _errorOccurred ) {

                const error = new BaseError( ErrorTypes.VALIDATION_ERROR, ErrorCodes.VALIDATION_ERROR, _errorMessage );
                this.setError( error );
                return appointment;

            }
            
            /***** PERSIST ****/
            
            let savedDay;

            if( _addMissingIntervals ) {

                savedDay = this._repo.addIntervalsToDay( _storedDay.id, appointment.intervals );
                
            } else {
                
                savedDay = this._repo.save( appointment );                               

            }

            if(_storedDaily && _storedDaily.intervals)
                    this._repo.addIntervalsToDay( savedDay.id, _storedDaily.intervals );

            if(_storedWeekly && _storedWeekly.intervals){
                    
                const _postedDayNumber  = moment(appointment.dayDate, 'DD-MM-YYYY').day();
                const _weeklyDayNames   = _storedWeekly.dayNames;
                    
                for(let i = 0 ; i < _weeklyDayNames.length ; i++){

                    if(_postedDayNumber === this._getDayNumberFromDayName( _weeklyDayNames[i] ) ){
                        this._repo.addIntervalsToDay( savedDay.id, _storedWeekly.intervals );               
                            
                    }
                }                    
            }

            return this._repo.findDayById( savedDay.id );
                                    
           // return; //debug
        } else if (appointment.type === AppointmentType.DAILY ) {

            if ( _storedDaily ) {

                if( !appointment.validateIntervalsAgainst( _storedDaily.intervals ) ) {

                    _errorOccurred  = true;
                    _errorMessage   = 'Conflict with another daily rule: ' + appointment.getError();

                } else {

                    _addMissingIntervals = true;

                }

            }
           
            if ( !_errorOccurred && _storedDays.length > 0 ) {

                for( let i = 0 ; i < _storedDays.length ; i ++) {

                    if( !appointment.validateIntervalsAgainst( _storedDays[i].intervals ) ) {

                        _errorOccurred  = true;
                        _errorMessage   = `Conflic with day rule for [ ${_storedDays[i].dayDate} ]: ` + appointment.getError();
                        break;                        

                    }

                }

            }

            if ( !_errorOccurred && _storedWeekly ) {

                if( !appointment.validateIntervalsAgainst( _storedWeekly.intervals ) ) {

                    _errorOccurred  = true;
                    _errorMessage   = 'Conflic daily rule : ' + appointment.getError();

                }

            }

            if( _errorOccurred ) {

                const error = new BaseError( ErrorTypes.VALIDATION_ERROR, ErrorCodes.VALIDATION_ERROR, _errorMessage );
                this.setError( error );
                return appointment;

            }

            let savedDaily;

            if( _addMissingIntervals ) {

                this._repo.addIntervalsToWeekly( appointment.intervals );
                savedDaily = this._repo.addIntervalsToDaily( appointment.intervals );

            } else {

                savedDaily = this._repo.save( appointment );
                this._repo.addIntervalsToWeekly( appointment.intervals );

            }

            for( let i = 0 ; i < _storedDays.length ; i ++) {

                this._repo.addIntervalsToDay( _storedDays[i].id, appointment.intervals ); 

            }

            return savedDaily;

        } else if ( appointment.type === AppointmentType.WEEKLY ) {

            let _postedDayNames     = appointment.dayNames;
            let _daysIdsCollection  = [];
            let _dayNumber;

            if( _storedWeekly ) {

                let _storedDayNames = _storedWeekly.dayNames;                                
                let _missingDays    = this.getMissingDays( _postedDayNames, _storedDayNames );

                if( !appointment.validateIntervalsAgainst( _storedWeekly.intervals ) ) {

                    _errorOccurred  = true;
                    _errorMessage   = `Conflict with another weekly rule: ` + appointment.getError();

                } else {

                    _addMissingIntervals = true;

                }

                if( !_errorOccurred && _storedDaily ) {

                    if( !appointment.validateIntervalsAgainst( _storedDaily.intervals ) ){

                        _errorOccurred  = true;
                        _errorMessage   = `Conflict with daily rule: ` + appointment.getError();

                    }

                }

                if( !_errorOccurred && _storedDays ) {
               
                    if( _missingDays.length > 0 ){

                        for( let i = 0 ; i < _missingDays.length ; i++ ){
                        
                            _dayNumber = this._getDayNumberFromDayName( _missingDays[i] );

                            for( let j = 0 ; j < _storedDays.length ; j++ ){

                                if( _dayNumber === moment( _storedDays[j].dayDate, 'DD-MM-YYYY').day() ) {

                                if ( !appointment.validateIntervalsAgainst( _storedDays[j].intervals ) ) {

                                        _errorOccurred  = true;
                                        _errorMessage   = `Conflict with day rule for [ ${_missingDays[i]} ${_storedDays[j].dayDate}]: ` + appointment.getError();
                                        break;  

                                    } else {

                                        _daysIdsCollection.push( _storedDays[j].id );

                                    }
                                }
                            }
                        }                  
                    }
                }

                if( _errorOccurred ){

                    const error = new BaseError( ErrorTypes.VALIDATION_ERROR, ErrorCodes.VALIDATION_ERROR, _errorMessage );
                    this.setError( error );
                    return appointment;

                }
                
                for( let i = 0 ; i < _daysIdsCollection.length ; i++ ) {

                    this._repo.addIntervalsToDay( _daysIdsCollection[i], appointment.intervals )

                }

                return this._repo.addIntervalsToWeekly( appointment.intervals );

            } else {

                if( !_errorOccurred && _storedDaily ) {

                    if( !appointment.validateIntervalsAgainst( _storedDaily.intervals ) ){

                        _errorOccurred  = true;
                        _errorMessage   = `Conflict with daily rule: ` + appointment.getError();

                    }

                }

                if( !_errorOccurred && _storedDays ) {

                    for( let i = 0 ; i < _postedDayNames.length ; i++ ){
                        
                        _dayNumber = this._getDayNumberFromDayName( _postedDayNames[i] );

                        for( let j = 0 ; j < _storedDays.length ; j++ ){

                            if( _dayNumber === moment( _storedDays[j].dayDate, 'DD-MM-YYYY').day() ) {

                                if ( !appointment.validateIntervalsAgainst( _storedDays[j].intervals ) ) {
                                    
                                    _errorOccurred  = true;
                                    _errorMessage   = `Conflict with day rule for [ ${_postedDayNames[i]} ${_storedDays[j].dayDate}]: ` + appointment.getError();
                                    break;  

                                } else {

                                    _daysIdsCollection.push( _storedDays[j].id );

                                }
                            }
                        }
                    }
                
                }

                if( _errorOccurred ){

                    const error = new BaseError( ErrorTypes.VALIDATION_ERROR, ErrorCodes.VALIDATION_ERROR, _errorMessage );
                    this.setError( error );
                    return appointment;

                }

                for( let i = 0 ; i < _daysIdsCollection.length ; i++ ) {

                    this._repo.addIntervalsToDay( _daysIdsCollection[i], appointment.intervals )

                }

                return this._repo.save( appointment );

            }

        }       

    }
        

    /**
     * Returns an integer that represents the day in a week
     * 
     * @param dayName 
     */
    _getDayNumberFromDayName(dayName: string) : number {

        const _dayName          = dayName.toLocaleLowerCase();
        const segundaRegex      = /segunda([-\s]feira)?/;
        const tercaRegex        = /ter[cç]a([-\s]feira)?/;
        const quartaRegex       = /quarta([-\s]feira)?/;
        const quintaRegex       = /quinta([-\s]feira)?/;
        const sextaRegex        = /sexta([-\s]feira)?/;
        const sabadoRegex       = /s[aá]bado/;
        
        if(_dayName === "domingo"){ 
            return 0;
        } else if ( _dayName.match(segundaRegex) ) {
            return 1;
        } else if ( _dayName.match(tercaRegex) ) {
            return 2;
        } else if ( _dayName.match(quartaRegex) ) {
            return 3;
        } else if ( _dayName.match(quintaRegex) ) {
            return 4;
        } else if ( _dayName.match(sextaRegex) ) {
            return 5;
        } else if ( _dayName.match(sabadoRegex) ) {
            return 6;
        }

        return -1;

    }

    deleteDayById(id: string, type: string) : boolean {
        
        return this._repo.deleteById( id, type );

    }

    getMissingIntervals(posted: Interval[], stored: Interval[]) : Interval[]{
        
        let _missingIntervals   = [];
        let _tmpPostedInterval;
        let _missing            = true;

        for( let i = 0 ; i < posted.length ; i++ ){

            _tmpPostedInterval = posted[i].toString();                    

            for( let j = 0 ; j < stored.length ; j++){

                if( _tmpPostedInterval === stored[j].toString() ){

                    _missing = false;
                    break;                          

                }
            }

            if( _missing ) {

                _missingIntervals.push( posted[i] );                        

            }
            _missing = true;                    
        }
        return _missingIntervals;
    }

    getMissingDays(posted: string[], stored: string[]) : string[]{
        
        let _missingDays   = [];
        let _tmpPostedDay;
        let _missing            = true;

        for( let i = 0 ; i < posted.length ; i++ ){

            _tmpPostedDay = posted[i];                    

            for( let j = 0 ; j < stored.length ; j++){

                if( _tmpPostedDay === stored[j] ){

                    _missing = false;
                    break;                          

                }
            }

            if( _missing ) {

                _missingDays.push( posted[i] );                        

            }
            _missing = true;                    
        }
        return _missingDays;
    }
   
    getAllDays(){

        return this._repo.findAll( AppointmentType.DAY );

    }

    getDaily(){

        return this._repo.findAll( AppointmentType.DAILY );

    }

    getWeekly(){

        return this._repo.findAll( AppointmentType.WEEKLY );

    }

    getAppointmentsBetween(initDate: string, endDate: string) : Appointment[]{
                
        return this._repo.getAppointmentsBetween( initDate, endDate );

    }
    
}

export default AppointmentService;