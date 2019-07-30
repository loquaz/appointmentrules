import BaseError from "../common/base-error";

interface IService<T>{

    build(data: Object) : T;
    setError(error: BaseError);
    getError() : BaseError;

}

export default IService;