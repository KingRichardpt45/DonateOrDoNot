"use client";

import styles from "../components/myCampaigns.module.css"; // Adjust the path if necessary
import SideMenu from "../components/SideMenu";
import { Header } from "../components/NavBarNotLogged";
import { useState } from "react";

export default function MyCampaigns() {
  // Example data for campaigns
  const activeCampaigns = [
    { id: 1, title: "Donate Blood & Save a Life", status: "Ongoing", image: "/images/testecampanha.png" },
    { id: 2, title: "Food Drive", status: "Under Review", image: "/images/testecampanha.png" },
    { id: 3, title: "", status: "", image: "/images/testecampanha.png" },
    { id: 4, title: "", status: "", image: "/images/testecampanha.png" },
    { id: 5, title: "", status: "", image: "/images/testecampanha.png" },
  ];

  const allCampaigns = [
    { id: 1, title: "Donate Blood & Save a Life", image: "/images/testecampanha.png" },
    { id: 2, title: "Food Drive", image: "/images/testecampanha.png" },
    { id: 3, title: "Puppy Paw", image: "/images/testecampanha.png" },
    { id: 4, title: "Hope for Orphans", image: "/images/testecampanha.png" },
    { id: 5, title: "Football Fundraiser", image: "/images/testecampanha.png" },
  ];

  return (
    <div className={styles.page}>
      <h1 className={styles.sectionTitle}>Active Campaigns</h1>
      <div className={styles.campaignsContainer}>
        {activeCampaigns.map((campaign, index) => (
          <div key={index} className={styles.campaignCard}>
            <img src={campaign.image} alt={campaign.title} className={styles.campaignImage} />
            {campaign.title && (
              <div className={styles.campaignInfo}>
                <h3 className={styles.campaignTitle}>{campaign.title}</h3>
                <p className={styles.campaignStatus}>{campaign.status}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <h1 className={styles.sectionTitle}>All campaigns created</h1>
      <div className={styles.searchContainer}>
        <input type="text" placeholder="Search..." className={styles.searchBar} />
      </div>
      <div className={styles.campaignsContainer}>
        {allCampaigns.map((campaign, index) => (
          <div key={index} className={styles.campaignCard}>
            <img src={campaign.image} alt={campaign.title} className={styles.campaignImage} />
            <div className={styles.campaignInfo}>
              <h3 className={styles.campaignTitle}>{campaign.title}</h3>
            </div>
          </div>
        ))}
      </div>
      <button className={styles.viewMoreButton}>View More</button>
    </div>
  );
}

