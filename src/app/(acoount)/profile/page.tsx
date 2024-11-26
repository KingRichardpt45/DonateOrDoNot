
import React from "react";
import NotAuthorized from "@/app/components/authorization/notAuthorized";
import NotLoggedIn from "@/app/components/authorization/notLogged";
import { MainLayout } from "@/app/components/coreComponents/mainLayout";
import SideProfile from "./sideProfile";
import styles from "./profile.module.css";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { User } from "@/models/User";
import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { EntityAdapter } from "@/models/adapter/EntityAdapter";



const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");
const ProfilePage = async () => {
  const user = await userProvider.getUser();
  const authorized =
    user !== null && (user as User).type === UserRoleTypes.Donor;
    
    function createTemplateUser(): User {
        const user = new User();
    
        user.first_name = "Carlos";
        user.last_name = "Silva";
        user.phone_number = "+351 912345678";
        user.birth_date = "1990-05-15";
        user.email = "carlos.silva@example.com";
        user.topDonation = 150.0;
        user.valueDonatedPerMonth = 75.0;
        user.badges = [
            { name: "Generous Donor", icon: "badge-generous.png" },
            { name: "Monthly Contributor", icon: "badge-monthly.png" },
        ];
        user.donatedCampaigns = [
            { name: "Save the Forests", image: "forest-campaign.jpg" },
            { name: "Education for All", image: "education-campaign.jpg" },
        ];
        user.lastBoughtItems = [
            { name: "T-shirt - Save the Oceans", image: "ocean-tshirt.jpg" },
            { name: "Eco Bag", image: "eco-bag.jpg" },
        ];
        user.type = UserRoleTypes.Donor;
    
        return user;
    }
    
const user1=createTemplateUser();
  return (
    <MainLayout passUser={user}>
      {user === null && <NotLoggedIn />}
      {!authorized && <NotAuthorized />}
      {authorized && (
        <div className={styles.ProfileContainer}>
          {/* Sidebar */}
          <SideProfile user={new EntityAdapter<User>(user1).getAdaptedObject()} />

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
                  <p>user1.topDonation.toFixed(2)</p>
                </div>
                <div>
                  <h3>Value Donated Per Month</h3>
                  <p>user1.valueDonatedPerMonth.toFixed(2)</p>
                </div>
              </div>
            </div>

            {/* Last Donated Section */}
            <div className={styles.LastDonated}>
              <h2>Last Donated</h2>
              {user1.lastDonatedCampaign ? (
                <img
                  src={`/campaigns/${user1.lastDonatedCampaign.image}`}
                  alt={user1.lastDonatedCampaign.name}
                />
              ) : (
                <p>No recent donations</p>
              )}
            </div>

            {/* My Badges */}
            <div className={styles.MyBadges}>
              <h2>My Badges</h2>
              <div className={styles.BadgesGrid}>
                {user1.badges.length > 0 ? (
                  user1.badges.map((badge, index) => (
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
                {user1.donatedCampaigns.length > 0 ? (
                  user1.donatedCampaigns.map((campaign, index) => (
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
                {user1.lastBoughtItems.length > 0 ? (
                  user1.lastBoughtItems.map((item, index) => (
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
        </div>
      )}
    </MainLayout>
  );
};

export default ProfilePage;
