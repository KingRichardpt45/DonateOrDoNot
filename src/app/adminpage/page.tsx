"use server";

import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { User } from "@/models/User";
import NotAuthorized from "../components/authorization/notAuthorized";
import NotLoggedIn from "../components/authorization/notLogged";
import { MainLayout } from "../components/coreComponents/mainLayout";
import AdminPanel from "./AdminPanel"; // Import the client-side component

import { Constraint } from "@/core/repository/Constraint";
import { CampaignStatus } from "@/models/types/CampaignStatus";
import { Operator } from "@/core/repository/Operator";
import { IncludeNavigation } from "@/core/repository/IncludeNavigation";
import { CampaignManagerManager } from "@/core/managers/CampaignManagerManager";
import { DonationCampaignManager } from "@/core/managers/DonationCampaignManager";
import { UserManager } from "@/core/managers/UserManager";
import { EntityConverter } from "@/core/repository/EntityConverter";
import { CampaignManager } from "@/models/CampaignManager";

const campaignManagers = new CampaignManagerManager();
const campaignsManager = new DonationCampaignManager();
const UserList= new UserManager();
const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");


const entityConverter = Services.getInstance().get<EntityConverter>("EntityConverter");

export default async function Admin() {
  const user = await userProvider.getUser();
  const authorized = user !== null && (user as User).type == UserRoleTypes.Admin;

  const status = [CampaignStatus.Active, CampaignStatus.Approved, CampaignStatus.InAnalysis];

  // Fetch active campaigns dynamically
  const UnverifiedManagers = await campaignManagers.getByCondition(
    [new Constraint("verified", Operator.EQUALS, false), new Constraint("Users.type", Operator.EQUALS, UserRoleTypes.CampaignManager)],(manager) => [new IncludeNavigation (manager.user, 0)]
  );

  const CampaignList = await campaignsManager.getByCondition( [ 
    new Constraint("status",Operator.IN,status)
  ],
  (campaign)=>[new IncludeNavigation(campaign.files,0)],
  [],0,0
)
const managersArray: CampaignManager[]=[];
UnverifiedManagers.forEach((manager) =>{
  managersArray.push(entityConverter.toPlainObject(manager) as CampaignManager);
});



  return (
    <MainLayout passUser={user}>
      {user === null && <NotLoggedIn />}
      {!authorized && <NotAuthorized />}
      {authorized && <AdminPanel campaigns={CampaignList} campaignManagers={managersArray as CampaignManager[]}/>}
    </MainLayout>
  );
}
