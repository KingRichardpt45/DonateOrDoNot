import {IOperationError} from "@/core/utils/operation_result/IOperationError";

export class FormError implements IOperationError {
    readonly field: string;
    readonly errors: string[];

    constructor(field: string, errors: string[] = []) {
        this.field = field;
        this.errors = errors;
    }
}