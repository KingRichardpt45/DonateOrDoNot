import {IOperationError} from "@/core/utils/operation_result/IOperationError";

export class OperationResult<T, ErrorType extends IOperationError> {
    readonly errors: ErrorType[];
    readonly value: T;
    readonly isOK: boolean;
    
    constructor(value: T, errors: ErrorType[]) {
        this.value = value;
        this.errors = errors;
        this.isOK = this.errors.length == 0;
    }
}