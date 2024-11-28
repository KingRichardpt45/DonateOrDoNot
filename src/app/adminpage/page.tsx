"use server";

import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { User } from "@/models/User";
import NotAuthorized from "../components/authorization/notAuthorized";
import NotLoggedIn from "../components/authorization/notLogged";
import { MainLayout } from "../components/coreComponents/mainLayout";
import AdminPanel from "./AdminPanel"; // Import the client-side component


import { CampaignStatus } from "@/models/types/CampaignStatus";
import { Constrain } from "@/core/repository/Constrain";
import { Operator } from "@/core/repository/Operator";
import { IncludeNavigation } from "@/core/repository/IncludeNavigation";
import { CampaignManagerManager } from "@/core/managers/CampaignManagerManager";
import { DonationCampaignManager } from "@/core/managers/DonationCampaignManager";
import { UserManager } from "@/core/managers/UserManager";

const campaignManagers = new CampaignManagerManager();
const campaignsManager = new DonationCampaignManager();
const UserList= new UserManager();
const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");

export default async function Admin() {
  const user = await userProvider.getUser();
  const authorized = user !== null && (user as User).type == UserRoleTypes.Admin;

  const status = [CampaignStatus.Active, CampaignStatus.Approved, CampaignStatus.InAnalysis];

  // Fetch active campaigns dynamically
  const UnverifiedManagers = await campaignManagers.getByCondition(
    [new Constrain("verified", Operator.EQUALS, false), new Constrain("Users.type", Operator.EQUALS, UserRoleTypes.CampaignManager)],(manager) => [new IncludeNavigation (manager.user, 0)]
  );

  const CampaignList = await campaignsManager.getByCondition( [ 
    new Constrain("status",Operator.IN,status)
  ],
  (campaign)=>[new IncludeNavigation(campaign.files,0)],
  [],0,0
)



  console.log(UnverifiedManagers);


  return (
    <MainLayout passUser={user}>
      {user === null && <NotLoggedIn />}
      {!authorized && <NotAuthorized />}
      {authorized && <AdminPanel campaigns={CampaignList} campaignManagers={UnverifiedManagers}/>}
    </MainLayout>
  );
}
