interface IRepository<T> {
    save(model: T) : T;
    find(model: T) : T;
    findById(id: String) : T;
    findByDay(day: string) : T;
    findByInterval(interval: string) : T;
    findByDayNames(daynames: string) : T;
    deleteById(id: string, type: string) : boolean;
}
export default IRepository;