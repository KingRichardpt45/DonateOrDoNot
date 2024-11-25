"use client";
import { useState} from "react";
import DonationModal from "./PopUpDonation/DonationPOP"; // Import DonationModal
import styles from "./components.module.css";
import Carousel from "./carousell"; // Importa o novo componente

const campaigns = [
  {
    image: "/images/hunger.png",
    title: "Fight Hunger",
    description:
      "Help us provide meals to those in need. Your donation can make a real difference in someone's life.",
    donationGoals: [
      "1€ = 2 meals",
      "5€ = 10 meals",
      "10€ = 20 meals and essential groceries",
      "20€ = 40 meals, groceries, and cooking supplies",
    ],
  },
  {
    image: "/images/Elephant.png",
    title: "Save the Elephants",
    description:
      "Join our efforts to protect elephants from poaching and preserve their natural habitats.",
    donationGoals: [
      "1€ = Protect 10 sq meters of habitat",
      "5€ = Provide a day's food for an elephant",
      "10€ = Support anti-poaching patrols for a day",
      "20€ = Contribute to elephant rehabilitation efforts",
    ],
  },
  {
    image: "/images/Football.png",
    title: "Football For All",
    description:
      "Join our efforts to protect elephants from poaching and preserve their natural habitats.",
    donationGoals: [
      "1€ = Protect 10 sq meters of habitat",
      "5€ = Provide a day's food for an elephant",
      "10€ = Support anti-poaching patrols for a day",
      "20€ = Contribute to elephant rehabilitation efforts",
    ],
  },
];

export default function Campaign(){
  
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false); // State for modal visibility


  return (
    <>
      <section className={styles.campaign}>
      <Carousel items={campaigns} />
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
    </>
  );
}
