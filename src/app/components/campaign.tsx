"use client";
import { useState} from "react";
import DonationModal from "./PopUpDonation/DonationPOP"; // Import DonationModal
import styles from "./components.module.css";
import Carousel from "./carousell"; // Importa o novo component


export default function CampaignPage(){
  
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false); // State for modal visibility

  return (
    <div style={{flexGrow:1,width:"100%"}}>
      <section className={styles.campaign}>
      <Carousel/>
        <div className={styles.bottomOverlay}>
          <p>Be one of this campaign's top Donors!</p>
          <button
            className={styles.donateNowButton}
            onClick={() => setIsDonationModalOpen(true)} // Open modal on click
            >
            Donate Now
          </button>
        </div>
      </section>

      {/* Donation Modal */}
      <DonationModal
        isOpen={isDonationModalOpen} // Modal visibility
        onClose={() => setIsDonationModalOpen(false)} // Close handler
        campaignId={1} donorId={1}      />
    </div>
  );
}
