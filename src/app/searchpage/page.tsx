import styles from "./search.module.css"; // CSS module for styling
import {MainLayout} from "../components/coreComponents/mainLayout";
import {Services} from "@/services/Services";
import {IUserProvider} from "@/services/session/userProvider/IUserProvider";
import NotAuthorized from "../components/authorization/notAuthorized";
import {User} from "@/models/User";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {DonationCampaignManager} from "@/core/managers/DonationCampaignManager";
import {EntityConverter} from "@/core/repository/EntityConverter";
import {CampaignStatus} from "@/models/types/CampaignStatus";
import {Constraint} from "@/core/repository/Constraint";
import {Operator} from "@/core/repository/Operator";
import {IncludeNavigation} from "@/core/repository/IncludeNavigation";


import CampaignsList from "./CampaignsList";

import {Campaign} from "@/models/Campaign";
import {FileManager} from "@/core/managers/FileManager";


const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");

const campaignsManager = new DonationCampaignManager();

const entityConverter = Services.getInstance().get<EntityConverter>("EntityConverter");

const filesManager = new  FileManager();

export default async function search() {
  const user = await userProvider.getUser();
  const authorized = user !== null && (user as User).type == UserRoleTypes.Donor;
  // Default campaigns array used for testing or displaying sample data
  

  const status = [CampaignStatus.Active];
  
  
  const CampaignList = await campaignsManager.getByCondition( [ 
    new Constraint("status",Operator.IN,status)
  ],
  (campaign)=>[new IncludeNavigation(campaign.files,0)],
  [],0,0
  )

  const campaignsArray: Campaign[]=[];
  CampaignList.forEach(async (campaign) =>{
    campaignsArray.push(entityConverter.toPlainObject(campaign) as Campaign);
  });

  return (
    <MainLayout passUser={user}>
        {
          !authorized && user!==null &&
          <NotAuthorized/>
        }
        {
          (authorized || user === null) &&
          <div className={styles.page}>
            <CampaignsList campaigns={campaignsArray as Campaign[]} />
          </div>
        }
    </MainLayout>
  );
}
