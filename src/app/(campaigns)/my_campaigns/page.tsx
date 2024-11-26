import styles from "./MyCampaigns.module.css";
import { MainLayout } from "../../components/coreComponents/mainLayout";
import { User } from "@/models/User";
import { DonationCampaignManager } from "@/core/managers/DonationCampaignManager";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import NotAuthorized from "../../components/authorization/notAuthorized";
import NotLoggedIn from "../../components/authorization/notLogged";
import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { Constrain } from "@/core/repository/Constrain";
import { Campaign } from "@/models/Campaign";
import { Operator } from "@/core/repository/Operator";
import { IncludeNavigation } from "@/core/repository/IncludeNavigation";
import { CampaignStatus } from "@/models/types/CampaignStatus";
import CampaignItem from "@/app/components/campaigns/CampaignsItem"
import SearchCampaigns from "@/app/components/search/searchCampaigns/searchCampaigns";

const campaignsManager = new DonationCampaignManager();
const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");

export default async function MyCampaigns() 
{
  const user = await userProvider.getUser();
  const authorized = user !== null && (user as User).type == UserRoleTypes.CampaignManager;

  let activeCampaigns :Campaign[]  = [];
  let createButtons = [];
  if(authorized)
  {
    const status = [CampaignStatus.Active,CampaignStatus.Approved,CampaignStatus.InAnalysis];
    activeCampaigns = await campaignsManager.getByCondition( [ new Constrain("campaign_manager_id",Operator.EQUALS,user.id),
                                                                      new Constrain("status",Operator.IN,status)
                                                                    ],
                                                                    (campaign)=>[new IncludeNavigation(campaign.files,0)],
                                                                    [],0,0
                                                                  )

    activeCampaigns.push(createSampeCampaign());                                                        
    
    for (let i = activeCampaigns.length; i < 5; i++) 
    {
      createButtons.push(
        <a href="/campaign-create" className={styles.ButtonCreateLink} key={`createButton_${i}`}>
          <div className={styles.ButtonCreate}>
            <svg className={styles.ButtonCreateIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512c282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0m0 961.008c-247.024 0-448-201.984-448-449.01c0-247.024 200.976-448 448-448s448 200.977 448 448s-200.976 449.01-448 449.01M736 480H544V288c0-17.664-14.336-32-32-32s-32 14.336-32 32v192H288c-17.664 0-32 14.336-32 32s14.336 32 32 32h192v192c0 17.664 14.336 32 32 32s32-14.336 32-32V544h192c17.664 0 32-14.336 32-32s-14.336-32-32-32"/></svg>
            <div>Create</div>
          </div>
        </a>
      )
    }
                                                                

  }
  
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
        <div className={styles.page} >
          <h1 className={styles.sectionTitle}>Active Campaigns</h1>
          <div className={styles.campaignsContainer}>
            {
              activeCampaigns.map( ( campaign:Campaign, index ) => 
                (  
                  <CampaignItem campaign={campaign} customStyle={
                    {
                      minWidth: "200px",
                      width:"20%",
                      height:250
                    }
                  } ></CampaignItem>
                )
              )
            }
            {
              createButtons.map( (value) => value)
            }
          </div>

          <h1 className={styles.sectionTitle}>All campaigns created</h1>
          <SearchCampaigns pageSize={25} managerId={user.id}/>
          <div className={styles.campaignsContainer}>
           
          </div>
        </div>
      }
    </MainLayout>
  );
}

function createSampeCampaign()
{
    const sampleCampaign = new Campaign();

sampleCampaign.id = 1;
sampleCampaign.title = "Save the Rainforest";
sampleCampaign.description = "A campaign to raise funds for the conservation of rainforests.";
sampleCampaign.objective_value = 1000000; // Objective in currency
sampleCampaign.current_donation_value = 700000; // Amount raised so far
sampleCampaign.category = "Environment";
sampleCampaign.end_date = new Date("2024-12-31");
sampleCampaign.contact_email = "contact@rainforestconservation.org";
sampleCampaign.contact_phone_number = "+123456789";
sampleCampaign.donation_counter = 1500; // Number of donations received
sampleCampaign.last_notified_value = 200000; // Amount at which notifications were last sent
sampleCampaign.interval_notification_value = 50000; // Notify every 50,000 raised
sampleCampaign.status = CampaignStatus.Active; // Current status of the campaign

sampleCampaign.campaign_manager_id = 42; // Reference to the campaign manager
sampleCampaign.bank_account_id = 101; // Reference to the bank account associated

return sampleCampaign;
}