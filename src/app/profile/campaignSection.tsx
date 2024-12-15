import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./profile.module.css";
import { File as ModelFile } from "@/models/File";

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
  // Paginação
  const indexOfLastCampaign = currentPage * itemsPerPage;
  const indexOfFirstCampaign = indexOfLastCampaign - itemsPerPage;
  const currentCampaigns = campaigns.slice(
    indexOfFirstCampaign,
    indexOfLastCampaign
  );
  const totalCampaigns = campaigns.length;

  return (
    <div className={styles.MyCampaigns}>
      <div className={styles.CampaignsHeader}>
        <h2>My Campaigns</h2>
        <span className={styles.TotalCampaigns}>
          Number of Campaigns: {totalCampaigns}
        </span>
      </div>

      <div className={styles.CampaignsGrid}>
        {currentCampaigns && currentCampaigns.length > 0 ? (
          currentCampaigns.map((campaign, index) => {
            // Construção do caminho da imagem
            /*const imagePathCampaign = `/documents/${campaign.image_id}_${
              (campaign.image.value as ModelFile)?.original_name || "default.jpg"
            }`;*/

            return (
              <div key={index} className={styles.CampaignItem}>
                <Image
                  src={""}
                  alt={campaign.name || "Campaign Image"}
                  className={styles.CampaignImage}
                  width={150}
                  height={100}
                />
                <h3>{campaign.name}</h3>
                <p>{campaign.description}</p>
              </div>
            );
          })
        ) : (
          <p>No campaigns found</p>
        )}
      </div>

      {/* Paginação */}
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
