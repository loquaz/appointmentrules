import IDatasource from "./idatasource";
import * as fs from 'fs';
import { execSync as nodeExec }  from 'child_process';
import { injectable } from "inversify";
import "reflect-metadata";
import * as shortid from 'shortid';
import Appointment from "../model/appointment";
import AppointmentType from "../appointmentType";

@injectable()
class JsonDatasource implements IDatasource<Appointment>{

    private _inMemory; 
    private _storageFile    = __dirname + "/appointments.json";    
    private _fs             = fs;
     
    constructor(){
        try{
            this._inMemory = JSON.parse( this._fs.readFileSync(this._storageFile, 'utf-8') );
            //console.log( this._inMemory['appointments'] ); 
        }catch(error){
            console.log(error.message);
        }
    }

    generateId():string{
        return shortid.generate();
    }

    save(model: Appointment) {
        
        let _collection = this._getCollection( model.type );

        model.id = this.generateId();
        _collection.push(model.toJson());
        this._saveCollection(model.type, _collection);
        console.log( '_collection', _collection );
        return model;
    }    

    /**
     * Removes an item from a specific denoted by type collection by id
     * 
     * @param id 
     * @param type 
     */
    deleteById(id: string, type: string) : boolean {
        
        let _collection     = this._getCollection( type );
        let _removed: any   = null;

        console.log( _collection.length );        

        for(let i = 0; i < _collection.length; i++){

            if( _collection[i]['id'] !== undefined && _collection[i]['id'] === id ){
                _removed = _collection.splice(i,1) // removes the object
                break;
            }

        }

        if(_removed){

            this._saveCollection( type, _collection );
            return true;

        }

        console.log( _collection.length );
        return false;
        
    }

    exists( model: Appointment ) : boolean{
        return false;
    }

    find(model: Appointment) : Appointment {

        // if the type is day
        let _days = this._inMemory['appointments']['days'];
        let _storedDay;
        
        //console.log('-----------', _days[0] );
        //console.log( '_days.length', _days.length );

        for(let i = 0; i < _days.length; i++){
            //console.log('_days[i]');
            if(model.dayDate === _days[i]['dayDate']){
                //console.log('-->');
                _storedDay = _days[i];
                return _storedDay;
                //console.log( 'JsonDatasource.find()', model);
            }            
        }; 

        return null;
    } 

    _getCollection( type: string ) : Object[] {
        
        let _collection;

        switch(type){
            
            case( AppointmentType.DAY ) :
                _collection = this._inMemory['appointments']['days']; break;
            case ( AppointmentType.DAILY ) :
                _collection = this._inMemory['appointments']['daily']; break;
            case ( AppointmentType.WEEK ) :
                _collection = this._inMemory['appointments']['weekly']; break;
            default: 
                _collection = []; break;
        }

        return _collection;
    }

    _saveCollection(type: string, collection: Object[]){

        let _saveInFile = true;
        
        switch(type){
            
            case( AppointmentType.DAY ) :
                this._inMemory['appointments']['days'] = collection; break;
            case( AppointmentType.DAY ) :
                this._inMemory['appointments']['daily'] = collection; break;
            case( AppointmentType.DAY ) :
                this._inMemory['appointments']['weekly'] = collection; break;
            default:
                _saveInFile = false; break;

        }

        if(_saveInFile){

            let _fd = this._fs.openSync(this._storageFile, 'w+');
            this._fs.writeSync( _fd, JSON.stringify( this._inMemory ) );

        }

    }

}
export default JsonDatasource;