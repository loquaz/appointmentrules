import IRepository from './irepository';
import Appointment from '../model/appointment';
import { injectable, inject } from "inversify";
import IDatasource from '../data/idatasource';

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
    
    findById(id: String): Appointment {
        throw new Error("Method not implemented.");
    }

    findByDay(day: string): Appointment {
        throw new Error("Method not implemented.");
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

}

export default AppointmentRepository;