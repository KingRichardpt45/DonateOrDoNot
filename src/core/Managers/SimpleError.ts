import { IOperationError } from "./IOperationError";

export class SimpleError implements IOperationError
{
    readonly error:string

    constructor(error:string)
    {
        this.error=error;
    }
}