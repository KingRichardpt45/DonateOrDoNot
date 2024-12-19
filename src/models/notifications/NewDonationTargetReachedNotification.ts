import { Notification } from "../Notification";
import { NotificationTypes } from "../types/NotificationTypes";

export class NewDonationTargetReachedNotification extends Notification
{
    constructor(target:number,campaign_id:number,newPercentageValue:number,campaignTitle:string)
    {
        super()
        this.user_id = target;
        this.message = `The people are helping ${campaignTitle} has reached ${newPercentageValue}% of objective.`;
        this.type = NotificationTypes.new_donation_target_reached;
        this.campaign_id=campaign_id
    }
}