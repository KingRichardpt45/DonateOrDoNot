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

// Dados de usuário estáticos (para testes)
const staticUser = {
  first_name: "Carlos",
  last_name: "Silva",
  phone_number: "+351 912345678",
  email: "carlos.silva@example.com",
  topDonation: 150.0,
  valueDonatedPerMonth: 75.0,
  badges: [
    { name: "Generous Donor", icon: "badge-generous.png" },
    { name: "Monthly Contributor", icon: "badge-monthly.png" },
  ],
  donatedCampaigns: [
    { name: "Save the Forests", image: "forest-campaign.jpg" },
    { name: "Education for All", image: "education-campaign.jpg" },
  ],
  lastBoughtItems: [
    { name: "T-shirt - Save the Oceans", image: "ocean-tshirt.jpg" },
    { name: "Eco Bag", image: "eco-bag.jpg" },
  ],
};

const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");
const ProfilePage = async () => {
  const user = await userProvider.getUser();
  const authorized = user !== null && (user as User).type == UserRoleTypes.Donor;
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
        <>
      <div className={styles.ProfileContainer}>
        {/* Sidebar */}
        <SideProfile initialUser={staticUser} />

        {/* Main Content */}
        <div className={styles.MainContent}>
          {/* Statistics Section */}
          <div className={styles.Statistics}>
            <h2>Statistics</h2>
            <div className={styles.StatisticsInfo}>
              <div>
                <h3>Number of Donations</h3>
                <p>5</p>
              </div>
              <div>
                <h3>Top Donation</h3>
                <p>${staticUser.topDonation.toFixed(2)}</p>
              </div>
              <div>
                <h3>Value Donated Per Month</h3>
                <p>${staticUser.valueDonatedPerMonth.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Last Donated Section */}
          <div className={styles.LastDonated}>
            <h2>Last Donated</h2>
            {staticUser.donatedCampaigns[0] ? (
              <img
                src={`/campaigns/${staticUser.donatedCampaigns[0].image}`}
                alt={staticUser.donatedCampaigns[0].name}
              />
            ) : (
              <p>No recent donations</p>
            )}
          </div>

          {/* My Badges */}
          <div className={styles.MyBadges}>
            <h2>My Badges</h2>
            <div className={styles.BadgesGrid}>
              {staticUser.badges.length > 0 ? (
                staticUser.badges.map((badge, index) => (
                  <img
                    key={index}
                    src={`/badges/${badge.icon}`}
                    alt={badge.name}
                  />
                ))
              ) : (
                <p>No badges earned yet</p>
              )}
            </div>
          </div>

          {/* Donated Campaigns */}
          <div className={styles.DonatedCampaigns}>
            <h2>Donated Campaigns</h2>
            <div className={styles.CampaignsGrid}>
              {staticUser.donatedCampaigns.length > 0 ? (
                staticUser.donatedCampaigns.map((campaign, index) => (
                  <img
                    key={index}
                    src={`/campaigns/${campaign.image}`}
                    alt={campaign.name}
                  />
                ))
              ) : (
                <p>No campaigns donated yet</p>
              )}
            </div>
          </div>

          {/* Last Bought Items */}
          <div className={styles.LastBought}>
            <h2>Last Bought</h2>
            <div className={styles.ItemsGrid}>
              {staticUser.lastBoughtItems.length > 0 ? (
                staticUser.lastBoughtItems.map((item, index) => (
                  <img
                    key={index}
                    src={`/items/${item.image}`}
                    alt={item.name}
                  />
                ))
              ) : (
                <p>No items purchased yet</p>
              )}
            </div>
          </div>
        </div>
      </div></>
      }
    </MainLayout>
  );
};

export default ProfilePage;
