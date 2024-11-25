import styles from "./profile.module.css";
import { User } from "@/models/User";
import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { File } from "@/models/File";
import { Badge } from "@/models/Badge";
import { Donor } from "@/models/Donor";
const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");

const ProfilePage = async () => {
  // Fetch the user via the userProvider
  const user = await userProvider.getUser();

  // Extract user's profile image if available
  let image: string | null = null;
  if (user && user.profileImage.value && (user.profileImage.value as File).id != null) {
    image = `${(user.profileImage.value as File).id}_${(user.profileImage.value as File).original_name}`;
  }

  return (
    <div className={styles.ProfileContainer}>
      {/* Sidebar */}
      <div className={styles.Sidebar}>
        <img
          src={image ? `/uploads/${image}` : "/default-profile.png"}
          alt="Profile"
          className={styles.ProfileImage}
        />
        <div className={styles.UserInfo}>
          <h1>{`${user?.first_name || "N/A"} ${user?.last_name || ""}`}</h1>
          <p>Phone: {user?.phone_number || "N/A"}</p>
          <p>Birth Date: {user?. || "N/A"}</p>
          <p>Email: {user?.email || "N/A"}</p>
          <p>Address: {user?.address_id || "N/A"}</p>
        </div>
        <button className={styles.LogoutButton}>Logout</button>
        <button className={styles.DeleteButton}>Delete Account</button>
      </div>

      {/* Main Content */}
      <div className={styles.MainContent}>
        {/* Statistics Section */}
        <div className={styles.Statistics}>
          <h2>Statistics</h2>
          <div className={styles.StatisticsInfo}>
            <div>
              <h3>Number of Donations</h3>
              <p>{Donor. || 0}</p>
            </div>
            <div>
              <h3>Top Donation</h3>
              <p>${user?.topDonation || "0.00"}</p>
            </div>
            <div>
              <h3>Value Donated Per Month</h3>
              <p>${user?. || "0.00"}</p>
            </div>
          </div>
        </div>

        {/* Last Donated Section */}
        <div className={styles.LastDonated}>
          <h2>Last Donated</h2>
          {user?.lastDonatedCampaign ? (
            <img
              src={`/campaigns/${user.lastDonatedCampaign.image}`}
              alt={user.lastDonatedCampaign.name}
            />
          ) : (
            <p>No recent donations</p>
          )}
        </div>

        {/* My Badges */}
        <div className={styles.MyBadges}>
          <h2>My Badges</h2>
          <div className={styles.BadgesGrid}>
            {Badge.length > 0 ? (
              user.badges.map((badge, index) => (
                <img key={index} src={`/badges/${badge.icon}`} alt={badge.name} />
              ))
            ) : (
              <p>No badges earned yet</p>
            )}
          </div>
        </div>

        {/* Donated Campaigns 
        <div className={styles.DonatedCampaigns}>
          <h2>Donated Campaigns</h2>
          <div className={styles.CampaignsGrid}>
            {user?.donatedCampaigns?.length > 0 ? (
              user.donatedCampaigns.map((campaign, index) => (
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
        </div>*/}

        {/* Last Bought Items 
        <div className={styles.LastBought}>
          <h2>Last Bought</h2>
          <div className={styles.ItemsGrid}>
            {user?.first_name == null ? (
              user.lastBoughtItems.map((item, index) => (
                <img key={index} src={`/items/${item.image}`} alt={item.name} />
              ))
            ) : (
              <p>No items purchased yet</p>
            )}
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default ProfilePage;
