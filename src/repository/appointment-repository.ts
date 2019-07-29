import IRepository from './irepository';
import Appointment from '../model/appointment';
import { injectable, inject } from "inversify";
import IDatasource from '../data/idatasource';
import Interval from '../model/interval';

@injectable()
class AppointmentRepository implements IRepository<Appointment>{
    
    private _ds : IDatasource<Appointment>;

    constructor(@inject("JsonDatasource") ds : IDatasource<Appointment> ){
        this._ds = ds;
    }

    save(model: Appointment) : Appointment {

        return this._ds.save( model );        
        //console.log( 'repository.save()', this._ds.find( model ) );
                
    }

    find(model: Appointment): Appointment {
        throw new Error("Method not implemented.");
    } 

    findAll(type: string) : Appointment[] {

        return this._ds.findAll( type );
    
    }
    
    findById(id: String): Appointment {
        throw new Error("Method not implemented.");
    }

    findByDate(date: string): Appointment {

        return this._ds.findByDate( date );
    }

    findByInterval(interval: string): Appointment {
        throw new Error("Method not implemented.");
    }

    findByDayNames(daynames: string): Appointment {
        throw new Error("Method not implemented.");
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

    getDaily() : Appointment {
        return this._ds.getDaily();
    }

    getAppointmentsBetween( initDate: string, endDate: string ) : Appointment[] {
        
        return this._ds.getAppointmentsBetween( initDate, endDate );
        
    }

}

export default AppointmentRepository;