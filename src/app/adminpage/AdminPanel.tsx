import React from "react";
import styles from "./admin.module.css";
import CampaignsAdmin from "./campaignsAdmin";
import {Campaign} from "@/models/Campaign";
import {CampaignManager} from "@/models/CampaignManager";


interface AdminPanelProps {
  campaigns: Campaign[];
  campaignManagers: CampaignManager[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ campaigns, campaignManagers}) => {
  // Example: Pre-filter campaigns by status

  return (
    <div className={styles.MainContainer}>
      <header className={styles.header}>
      </header>
      <CampaignsAdmin campaigns={campaigns} campaignManagers={campaignManagers} />
    </div>
  );
};

export default AdminPanel;
