"use client"
import React, { useRef, useState } from "react";
import Link from "next/link"; // Import Link from Next.js
import styles from "./campaignsAdmin.module.css";
import { Campaign } from "@/models/Campaign";
import { CampaignManager } from "@/models/CampaignManager";
import { User } from "@/models/User";
import CampaignManagerAction from "./campaignManagerAction";

import { IActionResultNotification } from "../components/actionsNotifications/IActionResultNotification";
import { ActionDisplay } from "../components/actionsNotifications/actionDisplay/ActionDisplay";
import { ActionResultNotificationError } from "../components/actionsNotifications/ActionResultNotificationError";
import { ActionResultNotificationSuccess } from "../components/actionsNotifications/ActionResultNotificationSuccess";

interface CampaignsAdminProps {
  campaigns: Campaign[]; // Pre-filtered and sorted campaigns
  campaignManagers: CampaignManager[]; // List of campaign managers
}


const campaignStatus = ["In Analysis", "Approved", "Active", "Reproved", "Closed"];
const campaignManagerTypes = ["Autonomous", "Institution"];

const CampaignsAdmin: React.FC<CampaignsAdminProps> = ({ campaigns, campaignManagers }) => {

  const [campaignManagersState,setCampaignManagersState] = useState<CampaignManager[]>(campaignManagers);
  const [actions,setActions] = useState<IActionResultNotification[]>([]);

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
                <Link href={`campaigns/edit/${campaign.id}`}>
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
          {campaignManagersState.map((manager) => (
            <div key={manager.id} className={styles.managerCard}>
              <h3>Manager ID: {manager.id}</h3>
              {/* Access user by index */}
              <p>Manager Name: {(manager.user.value as User).first_name} {(manager.user.value as User).middle_names ? (manager.user.value as User).middle_names : "" } {(manager.user.value as User).last_name ? (manager.user.value as User).last_name : "" }</p>
              <p>Description: {manager.description || "No description provided"}</p>
              <p>Email: {manager.contact_email || "No email provided"}</p>
              <p>Verified: {manager.verified ? "Yes" : "No"}</p>
              <p>Type: {campaignManagerTypes[manager.type]}</p>
              <p>Identification File: {<a className={styles.pdfDownload} href={`/api/file/${manager.identification_file_id}`}>|download|</a>}</p>
              {/* Accept and Deny buttons for unverified managers */}
              {manager.verified == false && (
                <CampaignManagerAction managerId={(manager.id!)} 
                  onAccept={(managerId)=>{
                    console.log("called");
                    manager.verified=true; 
                    const array:CampaignManager[]= []
                    campaignManagersState.forEach( (a:CampaignManager)=> {if(a.id != managerId)array.push(a);}  ) 
                    setCampaignManagersState(array as CampaignManager[]);
                    setActions([new ActionResultNotificationSuccess(`${managerId} accepted.`,1000)]);
                    setTimeout( ()=> {setActions([]) , 1050});
                  }} 
                  onDenied={(managerId)=>{
                    manager.verified=false;
                    setActions([new ActionResultNotificationSuccess(`${managerId} denied.`,1000)]);
                    setTimeout( ()=> {setActions([]) , 1050});
                  }}/>
              )}
            </div>
          ))}
        </div>
      </div>
      { 
        actions.length > 0 &&
        (
            <ActionDisplay actions={actions} />
        )
      }
    </div>
  );
};

export default CampaignsAdmin;
