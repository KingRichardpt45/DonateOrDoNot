import NotAuthorized from "@/app/components/authorization/notAuthorized";
import NotLoggedIn from "@/app/components/authorization/notLogged";
import { MainLayout } from "@/app/components/coreComponents/mainLayout";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import styles from "./page.module.css";
import EditCampaignForm from "@/app/components/campaigns/edit/EditCampaignForm";
import { DonationCampaignManager } from "@/core/managers/DonationCampaignManager";
import { EntityConverter } from "@/core/repository/EntityConverter";
import { Campaign } from "@/models/Campaign";
import { IncludeNavigation } from "@/core/repository/IncludeNavigation";
import { Badge } from "@/models/Badge";
import { CampaignBadge } from "@/models/CampaignBadge";

const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");
const campaignsManager = new  DonationCampaignManager();
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
      [new IncludeNavigation(campaign.badges,0), new IncludeNavigation( (new CampaignBadge()).badge,1) ]  
  );

  if( campaign === null )
  {
    return (
      <MainLayout passUser={user}>
        <div className={styles.page}>Not Found 404</div>
      </MainLayout>
    );
  }

  const authorized = user?.type == UserRoleTypes.CampaignManager && user.id == campaign.campaign_manager_id;

  //const a  = entityConverter.toPlainObject(campaign) ;
  //console.log(a);
  
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
          <h1>Edit Campaign</h1>
          {/* <EditCampaignForm campaign={ entityConverter.toPlainObject(campaign) as Campaign }/> */}
        </div>
      }
    </MainLayout>
  );
}
