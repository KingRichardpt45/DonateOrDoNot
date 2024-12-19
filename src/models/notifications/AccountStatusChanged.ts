import { Notification } from "../Notification";
import { NotificationTypes } from "../types/NotificationTypes";

export class AccountStatusChanged extends Notification
{
   
    constructor(target:number,accepted:boolean)
    {
        super();
        this.user_id = target
        this.type = NotificationTypes.account_status_changed
        this.message = `Your Account Status as changed to ${accepted ? "Accepted": "Denied"}`;
    }
}