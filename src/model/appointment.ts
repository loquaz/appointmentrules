import IModel from './imodel';
import Interval from './interval';
import AppointmentType from '../common/appointmentType';
import * as moment from 'moment';
import BaseModel from './base-model';


class Appointment extends BaseModel implements IModel {
        
    id: any;
    type: AppointmentType; 
    dayDate: string;
    dayNames: string[];
    intervals: Interval[];
    
    constructor(){
        super();
    }

    validate(): boolean {
        
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
        if( this.type === AppointmentType.DAY ){
            
            let _date = moment(this.dayDate, 'DD-MM-YYYY');

            if( this.dayDate === null || !_date.isValid() ){ // validate date
                this.setError("Invalid date", "day", this.dayDate);
                return false;
            }

        }else if( this.type === AppointmentType.WEEKLY ){

            if( this.dayNames === null || this.dayNames.length === 0 ){ // validate date
                this.setError("Days can\'t be empty", "days", null);
                return false;
            } 

        } 

        if(this.intervals === null || this.intervals.length === 0){ 
            this.setError("Appointment intervals can\'t be empty", "intervals", null);
            return false;
        }else{
            let _intervals: Interval[] = this.intervals
            for(let i = 0; i < _intervals.length; i++){
                if( !_intervals[i].validate() ){
                    this.setError( "Invalid interval", "intervals", _intervals[i].toString() );
                    return false;
                }
            }//for

            // search for conflicts
            // sort by start
            let _shToSort = _intervals.map( ( interval, idx ) =>{
                return { 
                        "idx" : idx,
                        "hour" : moment(interval.start, 'HH:mm') 
                    }

            });
            
            let _hrAux;

            for( let i = 0; i < _shToSort.length; i++ ){
                for( let j = i+1; j < _shToSort.length; j++ ){
                
                    if( _shToSort[j]['hour'].isBefore( _shToSort[i]['hour'] ) ){

                        _hrAux = this.intervals[ _shToSort[j]['idx'] ];
                        this.intervals[ _shToSort[j]['idx'] ] = this.intervals[ _shToSort[i]['idx'] ];
                        this.intervals[ _shToSort[i]['idx'] ] = _hrAux;

                    }
                }
            }

            for( let i = 0 ; i < this.intervals.length; i++){

                if( ( i + 1 ) < this.intervals.length ) {
                    
                    let _currentEnd = moment( this.intervals[i].end, 'HH:mm' );
                    let _nextStart  = moment( this.intervals[i+1].start, 'HH:mm' );

                    if( _currentEnd.isSameOrAfter( _nextStart ) ){

                        this.setError("Interval conflict", "intervals", _intervals[i].toString() + ' ' + _intervals[i+1].toString() );
                        return false;

                    }
                }

            }

        }

        return true;
    }

    toJson(): Object {

        let _obj = {};
        let _intervals = this.intervals.map( i =>{
            return i.toJson();
        })

        if( this.type === AppointmentType.DAY ){

            _obj = {                
                "id" : this.id,
                "day" : this.dayDate,
                "intervals" : _intervals,                
            }
        }else if( this.type === AppointmentType.DAILY ){

            _obj = {
                "id" : this.id,
                "intervals" : _intervals
            }

        }else if(this.type === AppointmentType.WEEKLY){

            _obj = {
                "id" : this.id,
                "days" : this.dayNames,
                "intervals" : _intervals
            }

        }

        return _obj;
    }

    toJsonWithoutId(): Object{

        let _obj        = {};
        let _intervals  = this.intervals.map( i =>{
            return i.toJson();
        })

        if( this.type === AppointmentType.DAY ){

            _obj = {                
                "day" : this.dayDate,
                "intervals" : _intervals,                
            }
        }else if( this.type === AppointmentType.DAILY ){

            _obj = {
                "intervals" : _intervals
            }

        }else if(this.type === AppointmentType.WEEKLY){

            _obj = {
                "days" : this.dayNames,
                "intervals" : _intervals
            }

        }

        return _obj;
    }

}

export default Appointment;