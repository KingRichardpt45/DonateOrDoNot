import React from "react";
import Link from "next/link"; // Import Link from Next.js
import styles from "./campaignsAdmin.module.css";
import { Campaign } from "@/models/Campaign";
import { CampaignManager } from "@/models/CampaignManager";
import { User } from "@/models/User";

interface CampaignsAdminProps {
  campaigns: Campaign[]; // Pre-filtered and sorted campaigns
  campaignManagers: CampaignManager[]; // List of campaign managers
}

const campaignStatus = ["In Analysis", "Approved", "Active", "Reproved", "Closed"];
const campaignManagerTypes = ["Autonomous", "Institution"];

const CampaignsAdmin: React.FC<CampaignsAdminProps> = ({ campaigns, campaignManagers }) => {
  return (
    <div className={styles.container}>
      {/* Campaigns Section */}
      <div className={styles.leftContainer}>
        <h2 className={styles.title}>Campaigns</h2>
        <div className={styles.list}>
          {campaigns.map((campaign) => (
            <div key={campaign.id} className={styles.campaignCard}>
              <h3>{campaign.title}</h3>
              <p>{campaign.description}</p>
              <p>Status: {campaignStatus[campaign.status]}</p>
              {campaign.end_date && (
                <p>End Date: {new Date(campaign.end_date).toLocaleDateString()}</p>
              )}
              {/* Edit button for campaigns in "In Analysis" state */}
              {campaign.status === 0 && (
                <Link href={`/edit-campaign?id=${campaign.id}`}>
                  <button className={styles.editButton}>Edit</button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Managers Section */}
      <div className={styles.rightContainer}>
        <h2 className={styles.title}>Campaign Managers</h2>
        <div className={styles.list}>
          {campaignManagers.map((manager) => (
            <div key={manager.id} className={styles.managerCard}>
              <h3>Manager ID: {manager.id}</h3>
              {/* Access user by index */}
              <p>Manager Name: {(manager.user.value as User).first_name}</p>
              <p>Description: {manager.description || "No description provided"}</p>
              <p>Email: {manager.contact_email || "No email provided"}</p>
              <p>Verified: {manager.verified ? "Yes" : "No"}</p>
              <p>Type: {campaignManagerTypes[manager.type]}</p>
              {/* Accept and Deny buttons for unverified managers */}
              {manager.verified == false && (
                <div className={styles.actionButtons}>
                  <button className={styles.acceptButton}>Accept</button>
                  <button className={styles.denyButton}>Deny</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignsAdmin;
