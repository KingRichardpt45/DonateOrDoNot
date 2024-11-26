import CreateCampaignForm from "@/app/components/campaigns/create/CreateCampaignForm";
import styles from "./page.module.css";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { Services } from "@/services/Services";
import { User } from "@/models/User";
import { MainLayout } from "@/app/components/coreComponents/mainLayout";
import NotLoggedIn from "@/app/components/authorization/notLogged";
import NotAuthorized from "@/app/components/authorization/notAuthorized";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";

const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");

export default async function CampaignCreate() 
{
  const user = await userProvider.getUser();

  const authorized = user?.type == UserRoleTypes.CampaignManager
  
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
          <h1>Create Campaign</h1>
          <CreateCampaignForm managerId={user.id!}/>
        </div>
      }
    </MainLayout>
  );
}
