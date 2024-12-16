import React from "react";
import { MainLayout } from "@/app/components/coreComponents/mainLayout";
import SideProfile from "./sideProfile";
import styles from "./profile.module.css";
import NotAuthorized from "@/app/components/authorization/notAuthorized";
import NotLoggedIn from "@/app/components/authorization/notLogged";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { DonationManager } from "@/core/managers/DonationManager";
import { DonorManager } from "@/core/managers/DonorManager";
import { Constraint } from "@/core/repository/Constraint";
import { Operator } from "@/core/repository/Operator";
import { DonorBadgeManager } from "@/core/managers/DonorBadgesManager";
import { DonorStoreItemManager } from "@/core/managers/DonorStoreItemManager";
import { FileManager } from "@/core/managers/FileManager";
import BadgesSection from "./badgeSection";
import ItemsSection from "./itemSection";
import CampaignsSection from "./campaignSection";

// Define o tipo para searchParams
type SearchParams = {
  [key: string]: string | string[] | undefined;
};

// Instâncias de serviços
const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");
const donationManager = new DonationManager();
const donorBadgeManager = new DonorBadgeManager();
const donorStoreItemManager = new DonorStoreItemManager();
const donorManager = new DonorManager();
const filesManager = new FileManager();

const ProfilePage = async ({ searchParams }: { searchParams: SearchParams }) => {
  // Paginação
  const badgesPage = parseInt(
    (Array.isArray(searchParams.badgesPage)
      ? searchParams.badgesPage[0]
      : searchParams.badgesPage) || "1"
  );

  const itemsPage = parseInt(
    (Array.isArray(searchParams.itemsPage)
      ? searchParams.itemsPage[0]
      : searchParams.itemsPage) || "1"
  );

  const campaignsPage = parseInt(
    (Array.isArray(searchParams.campaignsPage)
      ? searchParams.campaignsPage[0]
      : searchParams.campaignsPage) || "1"
  );

  const badgesPerPage = 10;
  const itemsPerPage = 10;
  const campaignsPerPage = 5;

  // Buscar usuário autenticado
  const user = await userProvider.getUser();

  if (!user) return <NotLoggedIn />;
  if (user.type !== UserRoleTypes.Donor) return <NotAuthorized />;

  // Buscar dados necessários
  const donations = await donationManager.getDonationsOfDonor(user.id!, 0, 10);
  const badges = await donorBadgeManager.getBadgeOfDonor(user.id!, 0, 100);
  const items = await donorStoreItemManager.getItemsOfDonor(user.id!, 0, 100);

  const Donor = await donorManager.getByCondition([
    new Constraint("id", Operator.EQUALS, user?.id),
  ]);

  const donorData = Donor?.find((donor) => donor.id === user.id);
  const totalDonated = donorData?.total_donated_value || 0;
  const freqDon = donorData?.frequency_of_donation || 0;

  // Buscar imagem da campanha associada a uma doação
  const campaignImage = await filesManager.getByCondition([
    new Constraint("campaign_id", Operator.EQUALS, donations.value![0].campaign_id), // Exemplo de campanha fixa
    
  ]);
  const campaignImagePath = campaignImage?.[0]?.original_name
  ? `/documents/${campaignImage[0].user_id}_${campaignImage[0].original_name}`
  : "/default_campaign.jpg"; // Caminho padrão caso não tenha imagem

console.log(campaignImagePath);
  // Dados de campanha mockados (com base na imagem buscada)
  const campaigns = [
    {
      name: "My Donated Campaign",
      description: "Campaign description goes here",
      imagePath: campaignImagePath,
    },
  ];

  // Paginação para campanhas
  const indexOfLastCampaign = campaignsPage * campaignsPerPage;
  const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
  const currentCampaigns = campaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);

  return (
    <MainLayout passUser={user}>
      <div className={styles.ProfileContainer}>
        {/* Sidebar */}
        <SideProfile />

        {/* Main Content */}
        <div className={styles.MainContent}>
          {/* Statistics Section */}
          <div className={styles.Statistics}>
            <h2>Statistics</h2>
            <div className={styles.StatisticsInfo}>
              <div>
                <h3>Number of Donations</h3>
                <p>{donations.value?.length || 0}</p>
              </div>
              <div>
                <h3>Frequency of Donation</h3>
                <p>{freqDon}</p>
              </div>
              <div>
                <h3>Total Donated Value</h3>
                <p>${totalDonated}</p>
              </div>
            </div>
          </div>

          {/* Seção de Badges */}
          <BadgesSection
            badges={badges.value?.slice(
              (badgesPage - 1) * badgesPerPage,
              badgesPage * badgesPerPage
            )}
            currentPage={badgesPage}
            itemsPerPage={badgesPerPage}
            totalPages={Math.ceil(badges.value?.length / badgesPerPage)}
          />

          {/* Seção de Items */}
          <ItemsSection
            items={items.value?.slice(
              (itemsPage - 1) * itemsPerPage,
              itemsPage * itemsPerPage
            )}
            currentPage={itemsPage}
            itemsPerPage={itemsPerPage}
            totalPages={Math.ceil(items.value?.length / itemsPerPage)}
          />

          {/* Seção de Campanhas */}
          <CampaignsSection
            campaigns={currentCampaigns}
            currentPage={campaignsPage}
            itemsPerPage={campaignsPerPage}
            totalPages={1}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
