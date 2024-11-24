import { IActionResultNotification } from "./IActionResultNotification";

export class ActionResultNotificationSuccess implements IActionResultNotification
{
    message:string;
    duration_ms:number;
    actionResultType: string

    constructor(message:string,duration_ms:number)
    {
        this.actionResultType = "ActionResultNotificationSuccess";
        this.message = message;
        this.duration_ms = duration_ms;
    }
}