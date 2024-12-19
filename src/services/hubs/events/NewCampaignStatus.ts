import { IHubEvent } from "../IHubEvent";
import { Campaign } from "@/models/Campaign";
import { CampaignStatus } from "@/models/types/CampaignStatus";

type Data =
{
    campingId:number,
    newStatusNumber:CampaignStatus,
    newStatus:string 
}

export class NewCampaignStatus implements IHubEvent<Data>
{
    readonly name: string;
    readonly data: Data

    constructor(campaign:Campaign)
    {
        this.name = NewCampaignStatus.name
        this.data = {
            campingId:campaign.id!,
            newStatusNumber:campaign.status,
            newStatus:CampaignStatus[campaign.status]
        };
    }
}