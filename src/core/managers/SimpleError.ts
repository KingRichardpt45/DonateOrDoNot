import { IOperationError } from "@/core/managers/IOperationError";

export class SimpleError implements IOperationError
{
    readonly error:string

    constructor(error:string)
    {
        this.error=error;
    }
}