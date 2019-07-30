import IModel from "./imodel";
import BaseModel from "./base-model";
import * as moment from 'moment';

class Interval extends BaseModel implements IModel{
    
    start: string;
    end: string;

    constructor(start: string, end: string){
        super();
        this.start  = start;
        this.end    = end;
    }    
    
    validate(): boolean {
            
        let _start  = moment(this.start, 'HH:mm');
        let _end    = moment(this.end, 'HH:mm');
            
        if( !_start.isValid() || !_end.isValid() ){
            return false;
        }else if( !_start.isBefore(_end) ){
            return false;
        }
            
        return true;
    }    

    toString() {
        return `${this.start}_${this.end}`;
    }

    toJson(): Object {
        return {
            "start" : this.start,
            "end" : this.end
        }
    }
}

export default Interval;