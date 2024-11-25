import { IActionResultNotification } from "./IActionResultNotification";

export class ActionResultNotificationError implements IActionResultNotification
{
    field: string;
    errors:string[];
    duration_ms:number;
    actionResultType: string;

    constructor(field:string,errors:string[],duration_ms:number)
    {
        this.actionResultType = "ActionResultNotificationError";
        this.field = field;
        this.errors = errors;
        this.duration_ms = duration_ms;
    }
}