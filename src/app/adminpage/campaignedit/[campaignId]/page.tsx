import NotAuthorized from "@/app/components/authorization/notAuthorized";
import NotLoggedIn from "@/app/components/authorization/notLogged";
import { MainLayout } from "@/app/components/coreComponents/mainLayout";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import styles from "./EditCampaignAdminForm.module.css";
import EditCampaignAdminForm from "@/app/components/admin/EditCampaignAdminForm";
import { DonationCampaignManager } from "@/core/managers/DonationCampaignManager";
import { EntityConverter } from "@/core/repository/EntityConverter";
import { Campaign } from "@/models/Campaign";
import { IncludeNavigation } from "@/core/repository/IncludeNavigation";
import { Badge } from "@/models/Badge";
import { CampaignBadge } from "@/models/CampaignBadge";
import { FileManager } from "@/core/managers/FileManager";
import { Constrain } from "@/core/repository/Constrain";
import { Operator } from "@/core/repository/Operator";

const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");
const campaignsManager = new  DonationCampaignManager();
const filesManager = new  FileManager();
const entityConverter = Services.getInstance().get<EntityConverter>("EntityConverter");

export default async function CampaignEditPage({params}: { params: { campaignId: string } }) {
  const user = await userProvider.getUser();
  const { campaignId } = params;
  const parsedCampaignId: number = Number(campaignId);
  
  if (Number.isNaN(parsedCampaignId)) {
    return (
      <MainLayout passUser={user}>
        <div className={styles.page}>Not Found 404</div>
      </MainLayout>
    );
  }

  const campaign = await campaignsManager.getById(parsedCampaignId, (campaign) => [
    new IncludeNavigation(campaign.badges, 0),
    new IncludeNavigation(campaign.bank_account, 0),
    new IncludeNavigation((new CampaignBadge()).badge, 1),
    new IncludeNavigation((new Badge).image, 3),
  ]);



  campaign.files.value = await filesManager.getByCondition([new Constrain("campaign_id", Operator.EQUALS, campaign.id)], (v) => [], [], 0, 0);
  const authorized = user?.type === UserRoleTypes.Admin;
  const campaignAdPain = entityConverter.toPlainObject(campaign) as Campaign;

  return (
    <MainLayout passUser={user}>
      {authorized && (
        <div className={styles.page}>
          <h1>Edit Campaign</h1>
          <EditCampaignAdminForm
            campaign={campaignAdPain as Campaign}
            userId={user.id!}
          />
        </div>
      )}
    </MainLayout>
  );
}
