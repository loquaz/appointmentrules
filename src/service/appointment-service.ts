import Appointment from "../model/appointment";
import IService from './iservice';
import IRepository from '../repository/irepository';
import { inject, injectable } from "inversify";
import "reflect-metadata";
import Interval from "../model/interval";
import AppointmentType from "../common/appointmentType";
import BaseError from "../common/base-error";
import { ErrorTypes, ErrorCodes } from "../common/application-error";

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
        
        // if the appointment already exists 
        // stores only the missing intervals
        if( appointment.type === AppointmentType.DAY ){

            console.log('0000');

            let _day = this._repo.findByDate( appointment.dayDate );
            
            if( _day ){

                let _storedIntervals    = _day.intervals;
                let _postedIntervals    = appointment.intervals;                
                let _missingIntervals   = this.getMissingIntervals( _postedIntervals, _storedIntervals );
                                
                if( _missingIntervals.length > 0 ){
                   
                    // merge the missing interval with the current stored 
                    // to verify if any conflict will occurs
                    _missingIntervals.map( interval=>{

                        _day.intervals.push(interval);

                    });

                    if(!_day.validate()){
                        
                        const error = new BaseError( ErrorTypes.VALIDATION_ERROR, ErrorCodes.VALIDATION_ERROR, _day.getError() );
                        this.setError( error );
                        return appointment;
                    
                    }else{

                        return this._repo.addIntervalsToDay( _day.id, _missingIntervals );
                    
                    }

                } else {

                    const error = new BaseError( ErrorTypes.CONFLICT, ErrorCodes.CONFLICT, "Day appointment already exists" );
                    this.setError( error );
                    return appointment;

                }

            }else{

                return this._repo.save( appointment );

            } 

        }else if( appointment.type === AppointmentType.DAILY ){

            // if the daily appointment already exists 
            // add only the missing intervals
            let _daily = this._repo.getDaily();

            if( _daily ){

                let _storedIntervals    = _daily.intervals;
                let _postedIntervals    = appointment.intervals;                
                let _missingIntervals   = this.getMissingIntervals( _postedIntervals, _storedIntervals );

                if( _missingIntervals.length > 0 ){

                    // merge the missing interval with the current stored 
                    // to verify if any conflict will occurs
                    _missingIntervals.map( interval=>{

                        _daily.intervals.push(interval);
                        
                    });

                    if(!_daily.validate()){
                        
                        const error = new BaseError( ErrorTypes.VALIDATION_ERROR, ErrorCodes.VALIDATION_ERROR, _daily.getError() );
                        this.setError( error );
                        return appointment;
                    
                    }else{

                        return this._repo.addIntervalsToDaily( _missingIntervals );
                    
                    }


                } else {
                    
                    const error = new BaseError( ErrorTypes.CONFLICT, ErrorCodes.CONFLICT, "Daily appointment already exists" );
                    this.setError( error );
                    return appointment;

                }

            } else {

                return this._repo.save( appointment );

            }

        } else if ( appointment.type === AppointmentType.WEEKLY ) { 

            let _weekly = this._repo.getWeekly();

            if( _weekly ){

                let _storedIntervals    = _weekly.intervals;
                let _postedIntervals    = appointment.intervals;
                let _storedDays         = _weekly.dayNames;
                let _postedDays         = appointment.dayNames;                
                let _missingIntervals   = this.getMissingIntervals( _postedIntervals, _storedIntervals );
                let _missingDays        = this.getMissingDays( _postedDays, _storedDays );

                if( _missingDays.length === 0 && _missingIntervals.length === 0 ){

                    const error = new BaseError( ErrorTypes.CONFLICT, ErrorCodes.CONFLICT, "Weekly appointment already exists" );
                    this.setError( error );
                    return appointment;

                }else{

                    let _appointment: Appointment;
                
                    if( _missingDays.length > 0 ) {

                        _appointment = this._repo.addDaysToWeekly( _missingDays ); 

                    }

                    if( _missingIntervals.length > 0 ) {

                        // merge the missing interval with the current stored 
                        // to verify if any conflict will occurs
                        _missingIntervals.map( interval=>{

                            _weekly.intervals.push(interval);
                        
                        });

                        if(!_weekly.validate()){
                        
                            const error = new BaseError( ErrorTypes.VALIDATION_ERROR, ErrorCodes.VALIDATION_ERROR, _weekly.getError() );
                            this.setError( error );
                            return _appointment;
                    
                        }else{

                            _appointment = this._repo.addIntervalsToWeekly( _missingIntervals );
                    
                        }

                    }

                    return _appointment;

                }

            } else {

                return this._repo.save( appointment );

            }

         }
        
        // if we reach this point a wrong type was sent 
        return null;
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