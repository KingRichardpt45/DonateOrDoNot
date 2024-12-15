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
  const page = parseInt(
    (Array.isArray(searchParams.page)
      ? searchParams.page[0]
      : searchParams.page) || "1"
  );
  const badgesPerPage = 5;
  const itemsPerPage = 5;

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
  const indexOfLastBadge = page * badgesPerPage;
  const indexOfFirstBadge = indexOfLastBadge - badgesPerPage;
  const currentBadges = badges.value?.slice(
    indexOfFirstBadge,
    indexOfLastBadge
  );

  const indexOfLastItem = page * itemsPerPage;
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

          {/* My Badges Section */}
          <div className={styles.MyBadges}>
            <h2>My Badges</h2>
            <div className={styles.BadgesGrid}>
              {currentBadges && currentBadges.length > 0 ? (
                currentBadges.map((badge, index) => {
                  // Debugging geral
                  console.log("Badge data:", badge);
                  console.log("Badge image_id:", badge.image_id);
                  console.log(
                    "Badge image original_name:",
                    (badge.image.value as ModelFile).original_name
                  );

                  // Debugging do caminho da imagem
                  const imagePathBadge = `/documents/${badge.image_id}_${
                    (badge.image.value as ModelFile).original_name
                  }`;
                  console.log(
                    `Image path for badge ${badge.name || "unknown"}:`,
                    imagePathBadge
                  );

                  return (
                    <div key={index} className={styles.BadgeItem}>
                      <Image
                        src={imagePathBadge}
                        alt={badge.name || "Badge"}
                        className={styles.BadgeImage}
                        width={50}
                        height={50}
                      />
                      <p>{badge.name}</p>
                    </div>
                  );
                })
              ) : (
                <p>No badges earned yet</p>
              )}
            </div>

            <div className={styles.Pagination}>
              {[...Array(totalBadgesPages)].map((_, i) => (
                <Link
                  key={i}
                  href={`/profile?page=${i + 1}`}
                  className={page === i + 1 ? styles.Active : ""}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
          </div>

          {/* Last Bought Items Section */}
          <div className={styles.LastBought}>
            <h2>Last Bought</h2>
            <div className={styles.ItemsGrid}>
              {currentItems && currentItems.length > 0 ? (
                currentItems.map((item, index) => {
                  // Debugging do caminho da imagem
                  const imagePathItem = `/documents/${item.image_id}_${
                    (item.image.value as ModelFile).original_name
                  }`;
                  console.log(
                    `Image path for item ${item.name || "unknown"}:`,
                    imagePathItem
                  );

                  return (
                    <div key={index} className={styles.BadgeItem}>
                      <Image
                        src={imagePathItem}
                        alt={item.name || "item"}
                        className={styles.BadgeImage}
                        width={50}
                        height={50}
                      />
                      <p>{item.name}</p>
                      <p>{item.cost}</p>
                    </div>
                  );
                })
              ) : (
                <p>No items bought yet</p>
              )}
            </div>
            <div className={styles.Pagination}>
              {[...Array(totalItemsPages)].map((_, i) => (
                <Link
                  key={i}
                  href={`/profile?page=${i + 1}`}
                  className={page === i + 1 ? styles.Active : ""}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
