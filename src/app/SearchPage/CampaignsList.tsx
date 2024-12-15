"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./search.module.css";
import { Campaign } from "@/models/Campaign";


import { File as ModelFile} from "@/models/File";

import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { CampaignStatus } from "@/models/types/CampaignStatus";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { FileTypes } from "@/models/types/FileTypes";


const CampaignsList :React.FC<{campaigns:Campaign[]}> = ({campaigns}) =>{
    //console.log(campaigns);

    return(
    <div className={styles.container}>
              <div className={styles.campaignContainer}>
                <h2 className={styles.heading}>Other Campaigns</h2>
                {/* List of campaigns rendered dynamically from defaultCampaigns */}
                <div className={styles.campaignList}>
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
                </div>
              </div>
            </div>
            )
}

export default CampaignsList;