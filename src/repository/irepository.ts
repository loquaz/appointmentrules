interface IRepository<T> {
    
    save(model: T) : T;
    findDayById(id: string) : T;
    findAll(type: string) : T[];
    findByDate(day: string) : T;
    deleteById(id: string, type: string) : boolean;
    addIntervalsToDay(id: String, collection: Object[]): T;
    addIntervalsToDaily(collection: Object[]): T;
    addIntervalsToWeekly(collection: Object[]): T;
    addDaysToWeekly(days: string[]) : T;
    getDaily() : T;
    getWeekly() : T;
    getAppointmentsBetween(initDate: string, endDate: string) : T[];
    
}

export default IRepository;