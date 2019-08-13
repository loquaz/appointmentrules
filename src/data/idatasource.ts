interface IDatasource<T> {
    save(model: T);    
    deleteById(id: string, type: string) : boolean;
    findDayById(id: string) : T;
    findAll(type: string) : T[];
    findByDate(day: string) : T;
    addIntervalsToDay(id: String, collection: Object[]);
    getDaily(): T;
    getWeekly(): T;
    addIntervalsToDaily(collection: Object[]): T;
    addIntervalsToWeekly(collection: Object[]): T;
    addDaysToWeekly(days: string[]) : T;
    getAppointmentsBetween(initDate: string, endDate: string) : T[];
}
export default IDatasource;