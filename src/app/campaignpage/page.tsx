"use client";

import Image from "next/image"; // Used for optimized image rendering in Next.js
import { ExpandableSearchBar } from "../components/searchBar"; // Importing the search bar component
import styles from "./campaignpage.module.css"; // CSS module for styling
import Campaign from "../components/campaign"; // Campaign component
import { Search } from "lucide-react"; // Icon library
import { useState } from "react"; // React hook for managing state
import DonationModal from "../components/PopUpDonation/DonationPOP"; // Modal component for donation

export default function Home() {
  // Default campaigns array used for testing or displaying sample data
  const defaultCampaigns = [
    {
      title: "Donate Blood & Save a Life", // Campaign title
      image: "/images/Elephant.png", // Image path for the campaign
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

  // Function to open the donation modal
  const handleDonateNowClick = () => {
    setIsModalOpen(true); // Set modal state to open
  };

  // Function to close the donation modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Set modal state to closed
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>
          {/* Expandable search bar at the top of the page */}
          <ExpandableSearchBar />

          {/* Campaign component to display featured campaigns */}
          <Campaign />

          {/* Container for other campaigns */}
          <div className={styles.container}>
            <div className={styles.campaignContainer}>
              <h2 className={styles.heading}>Other Campaigns</h2>
              <div className={styles.progressContainer}>
  <span className={styles.progressText}>90%</span>
  <span className={styles.progressTextRight}>11000€/12000€</span>
  <div className={styles.progressBar}>
    <div className={styles.progress}></div>
  </div>
</div>
              {/* List of campaigns rendered dynamically from defaultCampaigns */}
              <div className={styles.campaignList}>
                {defaultCampaigns.map((campaign, index) => (
                  <div key={index} className={styles.campaignCard}>
                    <Image
                      src={campaign.image} // Campaign image
                      alt={campaign.title} // Alt text for accessibility
                      width={180} // Fixed width
                      height={100} // Fixed height
                      className={styles.image} // Style for the image
                    />
                    <h3 className={styles.title}>{campaign.title}</h3>
                  </div>
                ))}
              </div>

              {/* Button to open donation modal */}
              <div>
                <button className={styles.viewMore} onClick={handleDonateNowClick}>
                  Donate Now
                </button>

                {/* Donation modal with open/close state controlled by isModalOpen */}
                <DonationModal isOpen={isModalOpen} onClose={handleCloseModal} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
