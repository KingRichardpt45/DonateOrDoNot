import {DonationCampaignManager} from "@/core/managers/DonationCampaignManager";
import {Responses} from "@/core/utils/Responses";
import {Constraint} from "@/core/repository/Constraint";
import {Operator} from "@/core/repository/Operator";
import {Campaign} from "@/models/Campaign";
import {IncludeNavigation} from "@/core/repository/IncludeNavigation";
import {CampaignBadge} from "@/models/CampaignBadge";
import {Badge} from "@/models/Badge";
import {FileManager} from "@/core/managers/FileManager";
import {CampaignStatus} from "@/models/types/CampaignStatus";


const campaignDonationManager= new DonationCampaignManager();
const filesManager = new  FileManager();

export async function GET() {
    const topCampaigns = await campaignDonationManager.getByCondition(
        [ 
            new Constraint("status", Operator.EQUALS, CampaignStatus.Active)
        ],(campaign) => 
              [ new IncludeNavigation(campaign.badges,0), 
                new IncludeNavigation(campaign.bank_account,0), 
                new IncludeNavigation( (new CampaignBadge()).badge,1), 
                new IncludeNavigation((new Badge).image, 3),
              ], 
        [{ 
            column: `${Campaign.getTableName()}.current_donation_value`,
            order: "desc",                
        }],5,0
    );

    for (const campaign of topCampaigns) {
        campaign.files.value  = await filesManager.getByCondition([new Constraint("campaign_id",Operator.EQUALS,campaign.id)],(v)=>[],[],0,0);
    }

    return Responses.createSuccessResponse(topCampaigns); 
}