import IModel from './imodel';
import Interval from './interval';
import AppointmentType from '../appointmentType';
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
        
        console.log('appointment.validate()');

        /**
         * The validation depends on the type of appointment 
         * 
         * if the type is equal to:
         * 
         * AppointmentType.DAY: then properties <dayDate> and <intervals> are both required
         * AppointmentType.DAILY: then only property <intervals> are required
         * AppointmentType.WEEKLY: then only properties  <dayNames> and <intervals> are required 
         *  
         */
        if( this.type === AppointmentType.DAY ){
            
            let _date = moment(this.dayDate, 'DD-MM-YYYY');

            if( this.dayDate === null || !_date.isValid() ){ // validate date
                this.addError("Invalid date", "day", this.dayDate);
                return false;
            }else if(this.intervals === null){ 
                this.addError("Appointment intervals can\'t be empty", "intervals", null);
                return false;
            }else{
                let _intervals: Interval[] = this.intervals
                for(let i = 0; i < _intervals.length; i++){
                    if( !_intervals[i].validate() ){
                        this.addError("Invalid interval", "intervals", _intervals[i].toString());
                        return false;
                    }
                }//for
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

}

export default Appointment;