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
        }

         
        return  !this._existsIntervalsConflic();    // returns if exists a conflic

    }

    /**
     * Sort intervals
     */
    _sortIntervals(){

        
        let swapped;
        let n = this.intervals.length - 1;

        do {

            swapped = false;
            
            for(let i = 0 ; i < n ; i++) {

                let _currDate =  moment(this.intervals[i].start, 'HH:mm');
                let _nextDate =  moment(this.intervals[i+1].start, 'HH:mm'); 

                if( _currDate.isAfter(_nextDate )){

                    let _hrAux = this.intervals[ i ];
                    this.intervals[ i ] = this.intervals[ i + 1 ];
                    this.intervals[ i + 1 ] = _hrAux;
                    swapped = true  

                }

            }
            
        } while (swapped);

        //console.log( 'end', this.intervals );

    }

    /**
     * Verifies intervals conflicts
     */
    _existsIntervalsConflic() : boolean {

        console.log('_existsIntervalsConflic() before sort', this.intervals);

        this._sortIntervals();        

        console.log('_existsIntervalsConflic() after sort', this.intervals);
        
        for( let i = 0 ; i < this.intervals.length; i++){

            if( ( i + 1 ) < this.intervals.length ) {
                
                let _currentEnd = moment( this.intervals[i].end, 'HH:mm' );
                let _nextStart  = moment( this.intervals[i+1].start, 'HH:mm' );

                if( _currentEnd.isSameOrAfter( _nextStart ) ){

                    //console.log("===============================================");
                    this.setError("Interval conflict", "intervals", this.intervals[i].toString() + ' ' + this.intervals[i+1].toString() );
                    return true;

                }
            }

        }
        return false;
    }

    /**
     * Add missing intervals
     * 
     * @param suppliedIntervals 
     */
    validateIntervalsAgainst(suppliedIntervals: Interval[]){

        // merge the instance and supplied unique intervals
        const instanceIntervals             = this.intervals;
        const uniqueInstaceIntervals        = this._removeEqualIntervals(instanceIntervals, suppliedIntervals);
        const uniqueSuppliedIntervals       = this._removeEqualIntervals(suppliedIntervals, instanceIntervals);
        const uniqueIntervals: Interval[]   = [];

        uniqueInstaceIntervals.forEach( interval =>{
            uniqueIntervals.push( interval );
        });

        uniqueSuppliedIntervals.forEach( interval =>{
            uniqueIntervals.push( interval );
        });

        this.intervals = uniqueIntervals;
           
        // validates 
        let isValid = this.validate();
        
        if( uniqueInstaceIntervals.length === 0 ){
            for(let i = 0; i < instanceIntervals.length ; i++){
                for(let j = 0 ; j < suppliedIntervals.length ; j++){
                    if(instanceIntervals[i].toString() === suppliedIntervals[j].toString()){

                        this.setError("Interval Conflict", "Interval", instanceIntervals[i].toString());
                        isValid = false;
                        break;
                    }
                }
                if(!isValid) break; 
            }
        }
        /*        
        console.log('----------------------------------------------');
        console.log(`type [ ${this.type} ]`);
        console.log(" ** Instance Intervals ", instanceIntervals);        
        console.log(" ** Supplied Intervals ", suppliedIntervals);
        console.log(" ^==^ Unique Intance Intervals ", uniqueInstaceIntervals);
        console.log(" ** Unique Supplied Intervals ", uniqueSuppliedIntervals);
        console.log(" == Unique Intervals ", uniqueIntervals);
        
        console.log('----------------------------------------------');
        */
        
        // if validates, store the original intervals back into the instance
        if(isValid){            
            this.intervals = uniqueInstaceIntervals;
            this._sortIntervals();
        }
        
        return isValid;
    }

    /**
     * Returns intervals that exists only in the from parameter
     * 
     * @param from
     * @param whatRemove 
     */
    _removeEqualIntervals(from: Interval[], whatRemove: Interval[]){

        let _missingIntervals   = [];        
        let _missing            = true;

        for( let i = 0 ; i < from.length ; i++ ){

            for( let j = 0 ; j < whatRemove.length ; j++){

                if( from[i].toString() === whatRemove[j].toString() ){

                    _missing = false;
                    break;                          

                }
            }

            if( _missing ) {

                _missingIntervals.push( from[i] );                        

            }
            _missing = true;                    
        }
        return _missingIntervals;
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