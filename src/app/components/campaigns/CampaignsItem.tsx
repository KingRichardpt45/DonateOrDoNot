import { CampaignStatus } from "@/models/types/CampaignStatus";
import { Campaign } from "@/models/Campaign";
import { File } from "@/models/File";
import { FileTypes } from "@/models/types/FileTypes";
import styles from "./CampaignsItem.module.css"
import Image from 'next/image';
//import { useState } from "react";

const CampaignItem : React.FC<{ campaign:Campaign, customStyle:React.CSSProperties | 0 }>= ( { campaign, customStyle}) => 
{

    const mainFile = (campaign.files.value as File[]).find(
        (file: File) => file.file_type === FileTypes.MainImage
    );

    const manImage : string = mainFile ?  `/documents/${mainFile.id}_${mainFile.original_name}` : "/images/Missing.jpg"

    let statusColor = ""
    switch(campaign.status)
    {
        case CampaignStatus.Active:
        case CampaignStatus.Approved:
            statusColor= "#19ff00"
            break;
        case CampaignStatus.Closed:
        case CampaignStatus.Reproved:
            statusColor= "#ff0000"
            break;
        case CampaignStatus.InAnalysis:
            statusColor= "#ffee00"
            break;
    }

    let progress = 0;
    if(campaign.current_donation_value && campaign.objective_value)
        progress =  (campaign.current_donation_value / campaign.objective_value) *100

    return (
        <div className={styles.campaignContainer} // onMouseEnter={onHover} onMouseLeave={onHover}
            style={ customStyle  as React.CSSProperties}
        >
            <div className={styles.infoContainer}>
                <div className={`${styles.campaignContainerHoverBase} ${styles.campaignContainerHover}`}>
                        <div className={styles.campaignTitle}>{campaign.title}</div>
                        <div className={styles.description}>{campaign.description}</div>
                </div>
                <div className={styles.statusContainer}>
                    <div className={styles.status} style={{ '--StatusColor': `${statusColor}` } as React.CSSProperties} >{  CampaignStatus[campaign.status] }</div>
                    <div>
                        { CampaignStatus.Active == campaign.status && campaign.end_date
                        ? new Intl.DateTimeFormat("pt-PT", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        }).format(new Date(campaign.end_date))
                        : "No end date provided"}
                    </div> 
                </div>
                <div className={styles.progressbarContainer}>
                    <div className={styles.progressbar} style={{ '--Progress': `${progress}%` } as React.CSSProperties} ></div>
                </div> 
            </div>
            <Image
                src={manImage}
                alt={`campaign Image`}
                width={400}
                height={400}
                className={styles.campaignImage}
            />
        </div>
    );

};
export default CampaignItem;