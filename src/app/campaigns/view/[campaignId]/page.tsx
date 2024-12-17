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
import { Donor } from "@/models/Donor";

const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");
const campaignsManager = new  DonationCampaignManager();
const filesManager = new  FileManager();
const entityConverter = Services.getInstance().get<EntityConverter>("EntityConverter");


const donationCampaignManager= new DonationCampaignManager();


export default async function CampaignCreate({params}:{ params: { campaignId:string } }) 
{
  const user = await userProvider.getUser();
  const { campaignId } = await params;
  const parsedCampaignId: number = Number(campaignId);
  
  let campaign = null;
  let campaignAdPain = null;
  const plainTopDonors:Donor[]  = []; 
  
  if( !Number.isNaN(parsedCampaignId) )
  {
    const campaign = await campaignsManager.getById( parsedCampaignId,
      (campaign) => 
        [ new IncludeNavigation(campaign.badges,0), 
          new IncludeNavigation(campaign.bank_account,0), 
          new IncludeNavigation( (new CampaignBadge()).badge,1), 
          new IncludeNavigation((new Badge).image, 3),
        ]  
    );
    
    if( campaign !== null )
    {
      campaign.files.value  = await filesManager.getByCondition([new Constraint("campaign_id",Operator.EQUALS,campaign.id)],(v)=>[],[],0,0);
    
      campaignAdPain = entityConverter.toPlainObject(campaign) as Campaign;
      
      const result = await donationCampaignManager.getTopDonors(campaign.id!,0,5);
      const topDonors:Donor[] = result.value!;
     
      if(result.isOK){
        topDonors.forEach((donor) => plainTopDonors.push(entityConverter.toPlainObject(donor)as Donor) );
      }
    }
    
  }

  const authorized = user?.type == UserRoleTypes.Donor;
  
  return (
    <MainLayout passUser={null}>
      { Number.isNaN(parsedCampaignId) || !campaignAdPain &&

        <div className={styles.page}>Not Found 404</div>
      }
      {
        user === null &&
        <NotLoggedIn/>
      }
      {
        !authorized && user !== null &&
        <NotAuthorized/>
      }
      {
        authorized &&
        <div className={styles.page}>
          <ViewCampaignForm campaign={ campaignAdPain as Campaign} topDonors= {plainTopDonors as Donor[]} donorId={user.id!} />
        </div>
      }
    </MainLayout>
  );
}
