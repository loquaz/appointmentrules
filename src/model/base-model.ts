abstract class BaseModel {

    private _error: ModelError;

    constructor(){}

    /**
     * Set an error
     * 
     * @param message 
     * @param field 
     * @param originalValue 
     */
    setError(message: string, field: string, originalValue: string) : void {

        this._error = new ModelError( message, field, originalValue );

    }

    /**
     *  Return the error 
     */
    getError(): string {
        
        return this._error.toString();

    }

}

class ModelError {

    private _message : string;
    private _field : string;
    private _originalValue: string;

    constructor(msg: string, field: string, value: string){
        this._message        = msg;
        this._field          = field;
        this._originalValue  = value;
    }

    toString(){

        return `${this._message}, {${this._field}}, ${this._originalValue}`;

    }

}

export default BaseModel;