import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { Services } from "@/services/Services";
import { MainLayout } from "@/app/components/coreComponents/mainLayout";
import NotLoggedIn from "@/app/components/authorization/notLogged";
import NotAuthorized from "@/app/components/authorization/notAuthorized";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import ViewCampaignForm from "@/app/components/campaigns/view/ViewCampaignForm";
import styles from "./campaignpage.module.css";
import { Campaign } from "@/models/Campaign";
import { DonationCampaignManager } from "@/core/managers/DonationCampaignManager";
import { FileManager } from "@/core/managers/FileManager";
import { EntityConverter } from "@/core/repository/EntityConverter";
import { Constraint } from "@/core/repository/Constraint";
import { Operator } from "@/core/repository/Operator";
import { IncludeNavigation } from "@/core/repository/IncludeNavigation";
import { CampaignBadge } from "@/models/CampaignBadge";
import { Badge } from "@/models/Badge";

const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");
const campaignsManager = new  DonationCampaignManager();
const filesManager = new  FileManager();
const entityConverter = Services.getInstance().get<EntityConverter>("EntityConverter");


export default async function CampaignCreate({params}:{ params: { campaignId:string } }) 
{
  const user = await userProvider.getUser();
  const { campaignId } = await params;
  const parsedCampaignId: number = Number(campaignId);
  
  if( Number.isNaN(parsedCampaignId) )
  {
    return (
      <MainLayout passUser={user}>
        <div className={styles.page}>Not Found 404</div>
      </MainLayout>
    );
  }

  const campaign = await campaignsManager.getById( parsedCampaignId,
    (campaign) => 
      [ new IncludeNavigation(campaign.badges,0), 
        new IncludeNavigation(campaign.bank_account,0), 
        new IncludeNavigation( (new CampaignBadge()).badge,1), 
        new IncludeNavigation((new Badge).image, 3),
      ]  
  );

  
  if( campaign === null )
    {
      return (
        <MainLayout passUser={user}>
        <div className={styles.page}>Not Found 404</div>
      </MainLayout>
    );
  }
  campaign.files.value  = await filesManager.getByCondition([new Constraint("campaign_id",Operator.EQUALS,campaign.id)],(v)=>[],[],0,0);
  const authorized = user?.type == UserRoleTypes.Donor 
  const campaignAdPain = entityConverter.toPlainObject(campaign) as Campaign;


  
  return (
    <MainLayout passUser={user}>
      {
        user === null &&
        <NotLoggedIn/>
      }
      {
        !authorized &&
        <NotAuthorized/>
      }
      {
        authorized &&
        <div className={styles.page}>
          <ViewCampaignForm campaign={ campaignAdPain as Campaign} />
        </div>
      }
    </MainLayout>
  );
}
