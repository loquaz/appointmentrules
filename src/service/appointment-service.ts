import Appointment from "../model/appointment";
import IService from './iservice';
import IRepository from '../repository/irepository';
import { inject, injectable } from "inversify";
import "reflect-metadata";
import Interval from "../model/interval";

@injectable()
class AppointmentService implements IService<Appointment> {

    private _repo : IRepository<Appointment>;

    constructor(@inject("AppointmentRepository") repository: IRepository<Appointment>){

        this._repo = repository;

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
        appointment.dayNames    = data['daily'] || null;
        appointment.intervals   = this.buildIntervals( data['intervals'] );

        //console.log( 'service.build()', appointment  );
        //console.log( 'service.build()', appointment.intervals.toString()  );

        return appointment;

    }

    /**
     * Builds a collection of Interval objects from data
     * 
     * @param data 
     */
    buildIntervals(data: any[]) : Interval[] {
        
        let _intervals: Interval[];
        _intervals =  data.map( _intervalData => {
            return new Interval(_intervalData['start'], _intervalData['end']);
        });

        return _intervals;
    }

    create( appointment: Appointment ): Appointment {
        
        // if the appointment already exists 
        
        return this._repo.save( appointment );
    }

    deleteDayById(id: string, type: string) : boolean {
        
        return this._repo.deleteById( id, type );

    }

    exists( appointment: Appointment ) : boolean {
        return false;
    }
    
}

export default AppointmentService;