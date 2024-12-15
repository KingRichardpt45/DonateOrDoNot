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
import { File as ModelFile } from "@/models/File";
import Image from "next/image";
import Link from "next/link";
import BadgesSection from "./badgeSection";
import ItemsSection from "./itemSection";

// Define the type for searchParams
type SearchParams = {
  [key: string]: string | string[] | undefined;
};

const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");

const donationManager = new DonationManager();
const donorBadgeManager = new DonorBadgeManager();
const donorStoreItemManager = new DonorStoreItemManager();
const donorManager = new DonorManager();

const ProfilePage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
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
  const badgesPerPage = 10;
  const itemsPerPage = 10;

  // Fetch user from session provider
  const user = await userProvider.getUser();

  if (user === null) {
    return <NotLoggedIn />;
  }

  if (user.type !== UserRoleTypes.Donor) {
    return <NotAuthorized />;
  }

  // Fetch all necessary data
  const donations = await donationManager.getDonationsOfDonor(user.id!, 0, 10);
  const badges = await donorBadgeManager.getBadgeOfDonor(user.id!, 0, 100);
  const items = await donorStoreItemManager.getItemsOfDonor(user.id!, 0, 100);

  const Donor = await donorManager.getByCondition([
    new Constraint("id", Operator.EQUALS, user?.id),
  ]);

  // Extract donor data
  const donorData = Donor?.find((donor) => donor.id === user.id);
  const totalDonated = donorData?.total_donated_value || 0;
  const freqDon = donorData?.frequency_of_donation || 0;

  // Pagination logic
  const indexOfLastBadge = badgesPage * badgesPerPage;
  const indexOfFirstBadge = indexOfLastBadge - badgesPerPage;
  const currentBadges = badges.value?.slice(
    indexOfFirstBadge,
    indexOfLastBadge
  );

  const indexOfLastItem = itemsPage  * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.value?.slice(indexOfFirstItem, indexOfLastItem);

  const totalBadgesPages = Math.ceil(badges.value?.length / badgesPerPage);
  const totalItemsPages = Math.ceil(items.value?.length / itemsPerPage);

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
                <p>{donorData?.donations.isArray.length}</p>
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

          <BadgesSection
            badges={badges.value || []}
            currentPage={badgesPage}
            itemsPerPage={badgesPerPage}
            totalPages={totalBadgesPages}
          />
          
          <ItemsSection
            items={items.value || []}
            currentPage={itemsPage}
            itemsPerPage={itemsPerPage}
            totalPages={totalItemsPages}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
