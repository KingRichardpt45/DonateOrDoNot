import React from "react";
import styles from "./admin.module.css";
import CampaignsAdmin from "./campaignsAdmin";
import {Campaign} from "@/models/Campaign";
import {CampaignManager} from "@/models/CampaignManager";
import { Services } from "@/services/Services";
import { EntityConverter } from "@/core/repository/EntityConverter";


const entityConverter = Services.getInstance().get<EntityConverter>("EntityConverter");

interface AdminPanelProps {
  campaigns: Campaign[];
  campaignManagers: CampaignManager[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ campaigns, campaignManagers}) => {
  
  const plainCampaigns : Campaign[] = [];
  campaigns.forEach( (campaign) => plainCampaigns.push(entityConverter.toPlainObject(campaign) as Campaign ) )
  const plainCampaignManagers : CampaignManager[] = [];
  campaignManagers.forEach( (campManager) => plainCampaignManagers.push(entityConverter.toPlainObject(campManager)  as CampaignManager) )

  return (
    <div className={styles.MainContainer}>
      <CampaignsAdmin campaigns={plainCampaigns} campaignManagers={plainCampaignManagers} />
    </div>
  );
};

export default AdminPanel;
