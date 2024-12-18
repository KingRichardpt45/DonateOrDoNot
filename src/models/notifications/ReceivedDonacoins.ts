import { Notification } from "../Notification";
import { NotificationTypes } from "../types/NotificationTypes";

export class ReceivedDonacoins extends Notification
{
    constructor(target:number,value:number,reason:string)
    {
        super()
        this.user_id = target;
        this.message = `you have receive ${value} donacoins for ${reason}.`;
        this.type = NotificationTypes.received_donacoins;
    }
}