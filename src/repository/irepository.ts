interface IRepository<T> {
    save(model: T) : T;
    find(model: T) : T;
    findAll(type: string) : T[];
    findById(id: String) : T;
    findByDate(day: string) : T;
    findByInterval(interval: string) : T;
    findByDayNames(daynames: string) : T;
    deleteById(id: string, type: string) : boolean;
    addIntervalsToDay(id: String, collection: Object[]);
    addIntervalsToDaily(collection: Object[]);
    getDaily():T;
    getAppointmentsBetween(initDate: string, endDate: string) : T[];
    
}
export default IRepository;