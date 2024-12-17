"use client"
import React, { useState } from "react"; // Import React and hooks
import styles from "./Modal.module.css"; // Import CSS module for styling
import { TextArea } from "../textArea"; // Import the TextArea component

// Props type for the modal, defining whether it's open and the function to close it
type DonationModalProps = {
  isOpen: boolean; // Controls the visibility of the modal
  onClose: () => void; // Function to close the modal
  campaignId: number; // ID of the campaign to donate to
  donorId: number; // ID of the logged-in donor
};

// DonationModal functional component
const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  campaignId,
  donorId,
}) => {
  const [amount, setAmount] = useState(18); // State for donation amount
  const [selectedMethod, setSelectedMethod] = useState<string>(""); // State for selected payment method
  const [anonymous, setAnonymous] = useState<boolean>(false); // State for anonymous donation
  const [comment, setComment] = useState<string>(""); // State for user comment
  const [isLoading, setIsLoading] = useState(false); // State for loading status
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message

  // Function to handle donation submission
  const handleDonate = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    
    
    try {
      const formData = new FormData();
      formData.append("campaign_id", campaignId.toString() );
      formData.append("donor_id", donorId.toString());
      formData.append("comment", comment.trim());
      formData.append("value", amount.toString());
      formData.append("nameHidden", anonymous ? "true" : "false");
      // Send donation data to the API
      const response = await fetch("/api/donations",  { method: "PUT", body: formData });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("Thank you for your donation!");
      } else {
        const error = await response.json();
        setErrorMessage(error.errors?.[0] || "Failed to process your donation.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Early return if the modal is not open
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modalWrapper}>
        <div className={styles.modalContent}>
          <button className={styles.modalClose} onClick={onClose}>
            &times;
          </button>
          <h2 className={styles.modalTitle}>How much do you want to donate?</h2>
          <div className={styles.inputContainer}>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className={styles.input}
            />
            <span className={styles.currencySymbol}>$</span>
          </div>
          <div className={styles.donationAmounts}>
            {[5, 10, 20, 50, 100].map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className={`${styles.donationButton} ${
                  amt === amount ? styles.donationButtonSelected : ""
                }`}
              >
                {amt}$
              </button>
            ))}
          </div>
          <h3 className={styles.modalSubtitle}>Payment method:</h3>
          <div className={styles.paymentMethods}>
            {["MB WAY", "PayPal", "MasterCard"].map((method) => (
              <button
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={`${styles.paymentMethodButton} ${
                  selectedMethod === method ? styles.paymentMethodSelected : ""
                }`}
              >
                {method}
              </button>
            ))}
          </div>
          <p className={styles.modalText}>
            With this donation you will receive <strong>{amount * 100}</strong> 🪙
          </p>
          <TextArea
            placeholder="Write a comment on your donation"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.textarea}
          />
          <span>Do you want it to be an anonymous donation?</span>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="anonymous"
                checked={anonymous}
                onChange={() => setAnonymous(true)}
              />
              YES
            </label>
            <label>
              <input
                type="radio"
                name="anonymous"
                checked={!anonymous}
                onChange={() => setAnonymous(false)}
              />
              NO
            </label>
          </div>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>}
          <button
            onClick={handleDonate}
            className={styles.modalSubmit}
            disabled={isLoading || !selectedMethod}
          >
            {isLoading ? "Processing..." : "Donate"}
          </button>
        </div>
      </div>
    </>
  );
};

export default DonationModal;
