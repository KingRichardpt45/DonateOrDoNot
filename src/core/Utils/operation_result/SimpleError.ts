import {IOperationError} from "@/core/utils/operation_result/IOperationError";

export class SimpleError implements IOperationError {
    readonly error: string

    constructor(error: string) {
        this.error = error;
    }
}