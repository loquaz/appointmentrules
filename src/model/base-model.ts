abstract class BaseModel {

    private _errors: ModelError[] = [];

    constructor(){}

    /**
     * Add a model error
     * 
     * @param msg 
     * @param field 
     * @param value 
     */
    addError(msg: string, field: string, value: string) : void {
        this._errors.push( new ModelError( msg, field, value )  );
    }

    /**
     *  Returns all model errors
     * 
     */
    getErrors(): ModelError[] {
        return this._errors;
    }
}

class ModelError {

    message : string;
    field : string;
    originalValue: string;

    constructor(msg: string, field: string, value: string){
        this.message        = msg;
        this.field          = field;
        this.originalValue  = value;
    }

}

export default BaseModel;