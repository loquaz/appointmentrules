import { ErrorTypes } from "./application-error";

class BaseError {
    
    private _errorType : ErrorTypes;
    private _errorCode: number;
    private _errorMessage: string;

    constructor(type: ErrorTypes, code: number, message: string){

        this._errorType      = type;
        this._errorCode      = code;
        this._errorMessage   = message;

    }

    getType() : ErrorTypes {
        return this._errorType;
    }

    getCode() : number {
        return this._errorCode;
    }

    getMessage() : string {
        return this._errorMessage;
    }

}

export default BaseError;