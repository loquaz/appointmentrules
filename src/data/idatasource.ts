interface IDatasource<T> {
    save(model: T);    
    deleteById(id: string, type: string) : boolean;
    find(model: T): T;
    findAll(type: string) : T[];
    findByDate(day: string) : T;
    exists(model: T) : boolean;
    addIntervalsToDay(id: String, collection: Object[]);
    getDaily():T;
    addIntervalsToDaily(collection: Object[]);
    getAppointmentsBetween(initDate: string, endDate: string) : T[];
}
export default IDatasource;