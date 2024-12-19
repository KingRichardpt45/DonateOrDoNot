import { Notification } from "../Notification";
import { CampaignStatus } from "../types/CampaignStatus";
import { NotificationTypes } from "../types/NotificationTypes";

export class CampaignStatusNotification extends Notification
{
   
    constructor(target:number,campaignTitle:string,status:CampaignStatus)
    {
        super();
        this.user_id = target
        this.type = NotificationTypes.campaign_status_changed;
        this.message = `Your Campaign ${campaignTitle} as changed to ${CampaignStatus[status]}.`;
    }
}