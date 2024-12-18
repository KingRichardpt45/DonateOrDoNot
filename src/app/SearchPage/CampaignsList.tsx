"use client";

import React from "react";
import styles from "./search.module.css";
import {Campaign} from "@/models/Campaign";
import {CampaignStatus} from "@/models/types/CampaignStatus";
import Carousel from "../components/carousell";
import SearchCampaigns from "../components/search/searchCampaigns/searchCampaigns";


const CampaignsList :React.FC<{campaigns:Campaign[]}> = ({campaigns}) =>{
    //console.log(campaigns);
    const campaigns_Ids = campaigns.map((c) => c.id);

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * campaigns_Ids.length);
  
    // Use the random index for any logic as needed
    const randomCampaignId = campaigns_Ids[randomIndex];

    return(
      <div className={styles.container}>
        <div><Carousel onActualIdChange={(v)=>{}}/></div>
              <div className={styles.campaignContainer}>
                <div className={styles.buttoncontainer}>
                  <a href={`/campaigns/view/${randomCampaignId}`}>
                <button className={styles.donateNowButton}> Random Donate</button>
                  </a>
                </div>
                <h2 className={styles.heading}>Other Campaigns</h2>
                {/* List of campaigns rendered dynamically from defaultCampaigns */}
                <SearchCampaigns route="view" pageSize={5} managerId={null} exceptStatusList={[CampaignStatus.InAnalysis,CampaignStatus.Reproved] }mainSearch={true}></SearchCampaigns>
                {/* <div className={styles.campaignList}>
                  {campaigns.map((camp, index) => (
                    <div key={index} className={styles.campaignCard}>
                      <a href={`/campaigns/view/${camp.id}`}>
                      {(camp.files.value! as ModelFile[])
                        .filter((file: ModelFile) => file.file_type === FileTypes.MainImage)
                        .map((file: ModelFile) => (
                          <Image
                            key={file.id}
                            src={`/documents/${file.id}_${file.original_name}`}
                            alt={camp.title!}
                            width={180}
                            height={100}
                            className={styles.image}
                          />
                        ))}
                      </a>
                      <h3 className={styles.title}>{camp.title}</h3>
                    </div>
                  ))}
                </div> */}
              </div>
            </div> 
            )
}

export default CampaignsList;