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
import { Constrain } from "@/core/repository/Constrain";
import { Operator } from "@/core/repository/Operator";
import { DonorStoreItem } from "@/models/DonorStoreItem";


// Initialize userProvider to fetch the current logged-in user
const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");

// Static test data for debugging purposes
let totalDonated = 0; // Total donated amount by the user
let freqDon = 0; // Frequency of user's donations
let item="";

const ProfilePage = async () => {
  // Initialize managers for donations and donors
  const donationManager = new DonationManager();
  const donorManager = new DonorManager();
  const donorSItem = new DonorStoreItem();

  // Fetch user from session provider
  const user = await userProvider.getUser();

  // Fetch all donations of the donor
  const donations = await donationManager.getDonationsOfDonor.length;

  // Fetch donor details using a condition (matching user ID)
  const Donor = await donorManager.getByCondition([
    new Constrain("id", Operator.EQUALS, user?.id),
  ]);


  // Check if the donor exists and extract their data
  if (Donor && Donor.length > 0) {
    const donorData = Donor.find((donor) => donor.id === user?.id);

    if (donorData) {
      // Extract donation details if available
      totalDonated = donorData.total_donated_value || 0;
      freqDon = donorData.frequency_of_donation || 0;
      item = donorSItem.store_item.name 

      console.log(`Total donated value: ${totalDonated}`);
      console.log(`Donation frequency: ${freqDon}`);
    } else {
      console.log("No donation data found for this user.");
    }
  } else {
    console.log("No donor found.");
  }

  // Check user authorization
  const authorized =
    user !== null && (user as User).type === UserRoleTypes.Donor;

  console.log(Donor);

  return (
    <MainLayout passUser={user}>
      {/* Show Not Logged In Component if user is null */}
      {user === null && <NotLoggedIn />}

      {/* Show Not Authorized Component if user is not a donor */}
      {!authorized && <NotAuthorized />}

      {/* Render Profile Page if user is authorized */}
      {authorized && (
        <>
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
                    <p>{donations}</p>
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

              {/* Last Donated Section */}
              <div className={styles.LastDonated}>
                <h2>Last Donated</h2>
                <p>No recent donations</p>
              </div>

              {/* My Badges Section */}
              <div className={styles.MyBadges}>
                <h2>My Badges</h2>
                <div className={styles.BadgesGrid}>
                  <p>No badges earned yet</p>
                </div>
              </div>

              {/* Donated Campaigns Section */}
              <div className={styles.DonatedCampaigns}>
                <h2>Donated Campaigns</h2>
                <div className={styles.CampaignsGrid}>
                  <p>No campaigns donated yet</p>
                </div>
              </div>

              {/* Last Bought Items Section */}
              <div className={styles.LastBought}>
                <h2>Last Bought</h2>
                <div className={styles.ItemsGrid}>
                  <p>{item}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default ProfilePage;
