"use client";

import Image from "next/image";
import { ExpandableSearchBar } from "../components/searchBar";
import styles from "./campaignpage.module.css";
import Campaign from "../components/campaign";
import { useState } from "react";
import DonationModal from "../components/PopUpDonation/DonationPOP";

export default function Home() {
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(5000);
  const [goal, setGoal] = useState(12000);
  const progressPercentage = Math.min((currentAmount / goal) * 100, 100);

  const getProgressColor = (progressPercentage: number) => {
    if (progressPercentage < 20) return "red";
    if (progressPercentage < 50) return "yellow";
    return "green";
  };

  const progressColor = getProgressColor(progressPercentage);

  const handleDonateNowClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Array of documents (images, pdfs, videos)
  const documents = [
    { type: "image", src: "/images/Elephant.png", alt: "Elephant Image" },
    { type: "pdf", src: "/documents/sample.pdf", alt: "Sample PDF" },
    { type: "video", src: "/images/ricardo.mp4", alt: "Sample Video" },
    { type: "image", src: "/images/hunger.png", alt: "Hunger Image" },
  ];

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>
          <ExpandableSearchBar />
          <Campaign />
          <div className={styles.container}>
            <div className={styles.campaignContainer}>
              <div className={styles.progressContainer}>
                <span className={styles.progressText}>
                  {Math.round(progressPercentage)}%
                </span>
                <span className={styles.progressTextRight}>
                  {currentAmount}€/{goal}€
                </span>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progress}
                    style={{
                      width: `${progressPercentage}%`,
                      backgroundColor: progressColor,
                    }}
                  ></div>
                </div>
              </div>
              <h2 className={styles.heading}>Documents</h2>

              {/* Gallery container */}
              <div className={styles.gallery}>
                {documents.map((doc, index) => (
                  <div className={styles.galleryItem} key={index}>
                    {doc.type === "image" && (
                      <Image
                        src={doc.src}
                        alt={doc.alt}
                        width={150}
                        height={150}
                        className={styles.galleryImage}
                        onClick={() => alert(`Viewing image: ${doc.alt}`)}
                      />
                    )}
                    {doc.type === "pdf" && (
                      <div className={styles.pdfPreview}>
                        <a href={doc.src} target="_blank" rel="noopener noreferrer">
                          <button className={styles.viewPDF}>View PDF</button>
                        </a>
                      </div>
                    )}
                    {doc.type === "video" && (
                      <div className={styles.videoPreview}>
                        <video width="150" height="150" controls>
                          <source src={doc.src} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <button className={styles.viewMore} onClick={handleDonateNowClick}>
                  View More
                </button>
                <DonationModal isOpen={isModalOpen} onClose={handleCloseModal} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
