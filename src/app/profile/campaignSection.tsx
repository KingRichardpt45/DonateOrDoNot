import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./campaigns.module.css";

interface CampaignProps {
  campaigns: any[];
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
  const indexOfLastCampaign = currentPage * itemsPerPage;
  const indexOfFirstCampaign = indexOfLastCampaign - itemsPerPage;
  const currentCampaigns = campaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);
  const totalCampaigns = campaigns.length;

  return (
    <div className={styles.MyCampaigns}>
      <div className={styles.CampaignsHeader}>
        <h2>My Donations</h2>
        <span className={styles.TotalCampaigns}>
          Number of Campaigns: {totalCampaigns}
        </span>
      </div>

      <div className={styles.CampaignsGrid}>
        {currentCampaigns && currentCampaigns.length > 0 ? (
          currentCampaigns.map((campaign, index) => (
            <div key={index} className={styles.CampaignItem}>
              <a href={`/campaigns/view/${campaign.id}`}>
                <Image
                  src={campaign.imagePath}
                  alt={campaign.name || "Campaign"}
                  className={styles.CampaignImage}
                  width={100}
                  height={100}
                />
              </a>
              <div className={styles.CampaignDetails}>
                <h3>{campaign.name}</h3>
                
              </div>
            </div>
          ))
        ) : (
          <p>No campaigns available</p>
        )}
      </div>

      {/* Pagination */}
      <div className={styles.Pagination}>
        {[...Array(totalPages)].map((_, i) => (
          <Link
            key={i}
            href={`?campaignsPage=${i + 1}`}
            className={currentPage === i + 1 ? styles.Active : ""}
          >
            {i + 1}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CampaignsSection;
