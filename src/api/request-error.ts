class RequestError {

    private _statusCode: number;
    private _field: string;
    private _originalValue: string;
    private _message: string;

    constructor( statusCode: number, field: string, originalValue: string, message: string ) {
        
        this._statusCode    = statusCode;
        this._field         = field;
        this._originalValue = originalValue;
        this._message       = message;

    }

    getError(){

        return [{
            "statusCode" : this._statusCode,
            "field" : this._field,
            "originalValue" : this._originalValue,
            "message" : this._message, 
        }];

    }

}

export default RequestError;