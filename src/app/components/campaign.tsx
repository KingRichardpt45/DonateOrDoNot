"use client";
import { useState, useEffect } from "react";
import DonationModal from "./PopUpDonation/DonationPOP"; // Import DonationModal
import styles from "./components.module.css";
import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { User } from "@/models/User";
import { headers } from 'next/headers';
import { IAuthorizationService } from "@/services/session/authorizationService/IAuthorizationService";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { redirect } from "next/navigation"


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
  const [currentCampaign, setCurrentCampaign] = useState(0);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false); // State for modal visibility

  const nextCampaign = () => {
    setCurrentCampaign((prev) => (prev + 1) % campaigns.length);
  };

  const prevCampaign = () => {
    setCurrentCampaign((prev) => (prev - 1 + campaigns.length) % campaigns.length);
  };

  useEffect(() => {
    const interval = setInterval(nextCampaign, 3000);
    return () => clearInterval(interval);
  }, []);

  const campaign = campaigns[currentCampaign];
  return (
    <>
      <section className={styles.campaign}>
        <div className={styles.carousel}>
          {/* Indicators */}
          <div className={styles.indicators}>
            {campaigns.map((_, index) => (
              <span
                key={index}
                className={`${styles.dot} ${
                  currentCampaign === index ? styles.activeDot : ""
                }`}
                onClick={() => setCurrentCampaign(index)}
              ></span>
            ))}
          </div>

          <button className={styles.navButton} onClick={prevCampaign}>
            &lt;
          </button>
          <div
            className={styles.imageTrain}
            style={{ transform: `translateX(-${currentCampaign * 100}%)` }}
          >
            {campaigns.map((campaign, index) => (
              <img key={index} src={campaign.image} alt={campaign.title} />
            ))}
          </div>
          <button className={styles.navButton} onClick={nextCampaign}>
            &gt;
          </button>
        </div>

        <div className={styles.overlay}>
          <h2 className={styles.title}>{campaign.title}</h2>
          <p className={styles.description}>{campaign.description}</p>
          <div className={styles.donationGoals}>
            {campaign.donationGoals.map((goal, index) => (
              <p key={index}>{goal}</p>
            ))}
          </div>
        </div>

        {/* Bottom Overlay */}
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
      />
    </>
  );
}
