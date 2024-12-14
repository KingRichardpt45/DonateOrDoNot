import React from "react";
import { MainLayout } from "@/app/components/coreComponents/mainLayout";
import SideProfile from "./sideProfile";
import styles from "./profile.module.css";
import NotAuthorized from "@/app/components/authorization/notAuthorized";
import NotLoggedIn from "@/app/components/authorization/notLogged";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { User } from "@/models/User";
import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { DonationManager } from "@/core/managers/DonationManager";
import { DonorManager } from "@/core/managers/DonorManager";
import { Constraint } from "@/core/repository/Constraint";
import { Operator } from "@/core/repository/Operator";
import { DonorBadgeManager } from "@/core/managers/DonorBadgesManager";
import { DonorStoreItemManager } from "@/core/managers/DonorStoreItemManager";

const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");

const donationManager = new DonationManager();
const donorBadgeManager = new DonorBadgeManager();
const donorStoreItemManager = new DonorStoreItemManager();
const donorManager = new DonorManager();

const ProfilePage = async () => {
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
  const badges = await donorBadgeManager.getBadgeOfDonor(user.id!, 0, 10);
  const items = await donorStoreItemManager.getItemsOfDonor(user.id!, 0, 10);

  const Donor = await donorManager.getByCondition([
    new Constraint("id", Operator.EQUALS, user?.id),
  ]);

  // Extract donor data
  const donorData = Donor?.find((donor) => donor.id === user.id);
  const totalDonated = donorData?.total_donated_value || 0;
  const freqDon = donorData?.frequency_of_donation || 0;

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
                <p>{donations.isOK && donations.value!.length}</p>
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
              {badges.isOK && badges.value.length > 0 ? (
                badges.value.map((badge, index) => (
                  <div key={index}>{badge.name}</div>
                ))
              ) : (
                <p>No badges earned yet</p>
              )}
            </div>
          </div>

          {/* Last Bought Items Section */}
          <div className={styles.LastBought}>
            <h2>Last Bought</h2>
            <div className={styles.ItemsGrid}>
              {items.isOK && items.value.length > 0 ? (
                items.value.map((item, index) => (
                  <div key={index}>{item.name}</div>
                ))
              ) : (
                <p>No items bought yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
