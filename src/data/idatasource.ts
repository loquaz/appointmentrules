interface IDatasource<T> {
    save(model: T);    
    deleteById(id: string, type: string) : boolean;
    find(model: T): T;
    exists(model: T) : boolean;
}
export default IDatasource;