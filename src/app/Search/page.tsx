"use client";

import Image from "next/image";
import { ExpandableSearchBar } from "../components/searchBar";
import styles from "./search.module.css";
import Campaign from "../components/campaign";
import { Search } from "lucide-react";
import { useState } from "react";
import DonationModal from "../components/PopUpDonation/DonationPOP";

export default function Home() {
  // Default campaigns for testing
  const defaultCampaigns = [
    {
      title: "Donate Blood & Save a Life",
      image: "/images/Elephant.png",
    },
    {
      title: "Food Drive",
      image: "/images/hunger.png",
    },
    {
      title: "Puppy Paw Donation Drive",
      image: "/images/hunger.png",
    },
    {
      title: "Hope for Orphans",
      image: "/images/Elephant.png",
    },
    {
      title: "Football Fundraiser",
      image: "/images/Elephant.png",
    },
  ];

  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle opening the modal
  const handleDonateNowClick = () => {
    setIsModalOpen(true);
  };
  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>
          <ExpandableSearchBar />
          <Campaign />
          <div className={styles.container}>
            <div className={styles.campaignContainer}>
              <h2 className={styles.heading}>Other Campaigns</h2>
              <div className={styles.campaignList}>
                {defaultCampaigns.map((campaign, index) => (
                  <div key={index} className={styles.campaignCard}>
                    <Image
                      src={campaign.image}
                      alt={campaign.title}
                      width={180}
                      height={100}
                      className={styles.image}
                    />
                    <h3 className={styles.title}>{campaign.title}</h3>
                  </div>
                ))}
              </div>
              <div>
      <button className={styles.viewMore} onClick={handleDonateNowClick}>
        Donate Now
      </button>

      {/* Pass state to modal */}
      <DonationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
              
            </div>
          </div>
        </div>
      </main>


    </div>
  );
}
