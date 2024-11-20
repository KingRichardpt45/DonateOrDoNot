"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ExpandableSearchBar } from "../components/searchBar";
import styles from "./campaignpage.module.css";
import Campaign from "../components/campaign";
import DonationModal from "../components/PopUpDonation/DonationPOP";

export default function Home() {
  const documents = [
    { type: "image", src: "/images/Elephant.png", alt: "Elephant Image" },
    { type: "pdf", src: "/documents/sample.pdf", alt: "Sample PDF" },
    { type: "video", src: "/images/Musiquence DLC 2024-07-05 18-02-16.mp4", alt: "Sample Video" },
    { type: "image", src: "/images/hunger.png", alt: "Hunger Image" },
    { type: "image", src: "/images/Elephant.png", alt: "Elephant Image" },
    { type: "pdf", src: "/documents/sample.pdf", alt: "Sample PDF" },
    { type: "video", src: "/images/Musiquence DLC 2024-07-05 18-02-16.mp4", alt: "Sample Video" },
    { type: "image", src: "/images/hunger.png", alt: "Hunger Image" },
    { type: "image", src: "/images/Elephant.png", alt: "Elephant Image" },
    { type: "pdf", src: "/documents/sample.pdf", alt: "Sample PDF" },
    { type: "video", src: "/images/Musiquence DLC 2024-07-05 18-02-16.mp4", alt: "Sample Video" },
    { type: "image", src: "/images/hunger.png", alt: "Hunger Image" },
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ type: "", src: "", alt: "" });
  
  const [currentAmount, setCurrentAmount] = useState(5000);

  const [goal, setGoal] = useState(12000);
  const progressPercentage = Math.min((currentAmount / goal) * 100, 100);

  const getProgressColor = (progressPercentage: number) => {
    if (progressPercentage < 20) return "red";
    if (progressPercentage < 50) return "yellow";
    return "green";
  };

  const progressColor = getProgressColor(progressPercentage);

  const handleImageClick = (doc) => {
    setModalContent(doc);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ExpandableSearchBar />
        <Campaign />

        <div className={styles.container}>
            <div className={styles.campaignContainer}>
            <div className={styles.progressContainer}>
              <span className={styles.progressText}>{Math.round(progressPercentage)}%</span>
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
          </div>
        </div>
              <h2 className={styles.heading}>Documents</h2>
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
                  onClick={() => handleImageClick(doc)}
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
                  <video controls className={styles.previewVideo}>
                    <source src={doc.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal for image preview */}
        {modalOpen && (
          <div className={styles.modal} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              {modalContent.type === "image" && (
                <Image
                  src={modalContent.src}
                  alt={modalContent.alt}
                  width={500}
                  height={500}
                  className={styles.modalImage}
                />
              )}
              <button className={styles.closeButton} onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
