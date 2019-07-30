import BaseError from "./base-error";

class ApplicationError extends BaseError {

    private _status : number;

    constructor(status: number, type: ErrorTypes, code: number, message: string){
        
        super(type, code, message);
        this._status = status;
    }

    getError(){

        return {
            "status" : this._status,
            "errorCode" : this.getCode(),
            "errorType" : this.getType(),
            "errorMessage" : this.getMessage() 
        };

    }

    static buildFromBaseError(error: BaseError, status: number){

        return {

            "status" : status,
            "errorCode" : error.getCode(),
            "errorType" : error.getType(),
            "errorMessage" : error.getMessage() 
        
        }; 

    }

}

export default ApplicationError;
export enum ErrorCodes {

    VALIDATION_ERROR    = 1,
    CONFLICT            = 2,
    BAD_REQUEST         = 3,
    APPLICAITON_ERROR   = 4,
    NOT_FOUND           = 5,

};
export enum HttpStatusCodes {

    OK          = 200,
    CREATED     = 201,
    NO_CONTENT  = 204,
    BAD_REQUEST = 400,
    NOT_FOUND   = 404,
    CONFLICT    = 409

};

export enum ErrorTypes {

    VALIDATION_ERROR    = "Invalid data",
    CONFLICT            = "Resource already exists",
    BAD_REQUEST         = "Request Error",
    APPLICAITON_ERROR   = "Application error",
    NOT_FOUND           = "Resource not found"

};