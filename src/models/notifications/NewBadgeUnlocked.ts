import { Badge } from "../Badge";
import { Notification } from "../Notification";
import { BadgeTypes } from "../types/BadgeTypes";
import { CampaignStatus } from "../types/CampaignStatus";
import { NotificationTypes } from "../types/NotificationTypes";

export class NewBadgeUnlocked extends Notification
{
   
    constructor(target:number,badge:Badge)
    {
        super();
        this.user_id = target
        this.type = NotificationTypes.campaign_status_changed;
        this.message = `You have unlocked a new badge ${badge.name} of type ${BadgeTypes[badge.type]}.`;
    }
}