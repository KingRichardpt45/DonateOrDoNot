import React from "react";
import Image from "next/image";
import styles from "./profile.module.css";

interface CampaignProps {
  campaigns: {
    name: string;
    description: string;
    imagePath: string;
  }[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

const CampaignsSection: React.FC<CampaignProps> = ({
  campaigns,
  currentPage,
  itemsPerPage,
  totalPages,
}) => {
  return (
    <div className={styles.CampaignSection}>
      <h2>My Campaigns</h2>
      <div className={styles.CampaignsGrid}>
        {campaigns.map((campaign, index) => (
          <div key={index} className={styles.CampaignCard}>
            <Image
              src={campaign.imagePath}
              alt={campaign.name}
              width={200}
              height={150}
            />
            <h3>{campaign.name}</h3>
            <p>{campaign.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignsSection;
