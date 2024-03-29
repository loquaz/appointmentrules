import IRepository from './irepository';
import Appointment from '../model/appointment';
import { injectable, inject } from "inversify";
import IDatasource from '../data/idatasource';
import Interval from '../model/interval';
import AppointmentType from '../common/appointmentType';

@injectable()
class AppointmentRepository implements IRepository<Appointment>{
    
    private _ds : IDatasource<Appointment>;

    constructor(@inject("JsonDatasource") ds : IDatasource<Appointment> ){
        this._ds = ds;
    }

    save(model: Appointment) : Appointment {

        return this._ds.save( model ); 
                        
    }

    findAll(type: string) : Appointment[] {

        return this._ds.findAll( type );
    
    }
    
    findDayById(id: string) : Appointment {

        const data = this._ds.findDayById( id );

        console.log( data );

        const appointment       = new Appointment();
        appointment.type        = AppointmentType.DAY;
        appointment.id          = data['id']
        appointment.dayDate     = data['day']
        appointment.intervals   = data['intervals'].map( i =>{
            return new Interval(i['start'], i['end']);
        })
                
        return appointment;

    }
    
    findByDate(date: string): Appointment {

        return this._ds.findByDate( date );
    }
    
    deleteById(id: string, type: string) : boolean {

        return this._ds.deleteById( id, type );

    }

    addIntervalsToDay(dayId: string, intervals: Interval[]): Appointment {

        return this._ds.addIntervalsToDay( dayId, intervals );

    }

    addIntervalsToDaily(intervals: Interval[]): Appointment {

        return this._ds.addIntervalsToDaily( intervals );

    }

    addIntervalsToWeekly(intervals: Interval[]): Appointment {

        return this._ds.addIntervalsToWeekly( intervals );

    }

    addDaysToWeekly(days: string[]): Appointment {

        return this._ds.addDaysToWeekly( days );

    }

    getDaily() : Appointment {
        return this._ds.getDaily();
    }

    getWeekly() : Appointment {

        return this._ds.getWeekly();

    }

    getAppointmentsBetween( initDate: string, endDate: string ) : Appointment[] {
        
        return this._ds.getAppointmentsBetween( initDate, endDate );
        
    }

    

}

export default AppointmentRepository;