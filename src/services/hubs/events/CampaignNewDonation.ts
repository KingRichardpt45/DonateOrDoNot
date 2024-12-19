import { Notification } from "@/models/Notification";
import { IHubEvent } from "../IHubEvent";
import { Campaign } from "@/models/Campaign";

export class CampaignNewDonation implements IHubEvent<Campaign>
{
    readonly name: string;
    readonly data: Campaign;

    constructor(campaign:Campaign)
    {
        this.name = CampaignNewDonation.name
        this.data = campaign;
    }
}