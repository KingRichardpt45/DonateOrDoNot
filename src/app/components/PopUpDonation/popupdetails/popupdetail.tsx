import React from "react";
import styles from "./popupdetails.module.css"; // Import CSS module for styling

// Props type for the confirmation modal
type ConfirmationModalProps = {
  isOpen: boolean; // Controls the visibility of the confirmation modal
  onClose: () => void; // Function to close the modal
  onConfirm: () => void; // Function to confirm the donation
  donationDetails: {
    amount: number; // Donation amount
    method: string; // Payment method
    anonymous: boolean; // Anonymous donation toggle
    comment: string; // User's comment
  };
};

// ConfirmationModal functional component
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  donationDetails,
}) => {
  if (!isOpen) return null; // Prevent rendering when not open

  const { amount, method, anonymous,comment } = donationDetails; // Destructure donation details

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modalContent}>
        {/* Close button */}
        <button className={styles.modalClose} onClick={onClose}>
          &times; {/* Unicode character for 'X' */}
        </button>

        {/* Modal title */}
        <h2 className={styles.modalTitle}>Confirm Your Donation</h2>

        {/* Display donation details */}
        <p className={styles.modalText}>
          <strong>Donation Amount:</strong> ${amount}
        </p>
        <p className={styles.modalText}>
          <strong>Payment Method:</strong> {method || "Not Selected"}
        </p>
        <p className={styles.modalText}>
          <strong>Anonymous Donation:</strong> {anonymous ? "Yes" : "No"}
        </p>
        <p className={styles.modalText}>
          <strong>Won Donacoins:</strong> {amount*100}
        </p>
        {comment && (
          <p className={styles.modalText}>
            <strong>Comment:</strong> {comment}
          </p>
        )}

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Confirm
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
