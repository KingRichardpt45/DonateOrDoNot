import React from "react";
import styles from "./admin.module.css";
import CampaignsAdmin from "./campaignsAdmin";
import { Campaign } from "@/models/Campaign";
import { CampaignManager } from "@/models/CampaignManager";


interface AdminPanelProps {
  campaigns: Campaign[];
  users: CampaignManager[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ campaigns, users }) => {
  // Example: Pre-filter campaigns by status

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>Admin Panel</h1>
      </header>
      <CampaignsAdmin campaigns={campaigns} campaignManagers={users} />
    </div>
  );
};

export default AdminPanel;
