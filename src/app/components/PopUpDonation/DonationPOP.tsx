import styles from "./Modal.module.css"; // Import CSS module for styling
import React, { useState } from "react"; // Import React and hooks
import { TextArea } from "../textArea"; // Import the TextArea component

// Props type for the modal, defining whether it's open and the function to close it
type DonationModalProps = {
  isOpen: boolean; // Controls the visibility of the modal
  onClose: () => void; // Function to close the modal
};

// DonationModal functional component
const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  // State for donation amount
  const [amount, setAmount] = useState(18);

  // State for selected payment method (e.g., "PayPal")
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  // State for anonymous donation toggle
  const [anonymous, setAnonymous] = useState<boolean>(false);

  // State for user comment on the donation
  const [comment, setComment] = useState<string>("");

  // Return null if the modal is not open, preventing it from rendering
  if (!isOpen) return null;

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modalContent}>
        {/* Close button to close the modal */}
        <button className={styles.modalClose} onClick={onClose}>
          &times; {/* Unicode character for 'X' */}
        </button>

        {/* Modal title */}
        <h2 className={styles.modalTitle}>How much do you want to donate?</h2>

        {/* Donation input field for custom amounts */}
        <div className={styles.inputContainer}>
          <input
            type="number"
            value={amount} // Current donation amount
            onChange={(e) => setAmount(Number(e.target.value))} // Update amount
            className={styles.input}
          />
          <span className={styles.currencySymbol}>$</span> {/* Display currency */}
        </div>

        {/* Predefined donation amounts for quick selection */}
        <div className={styles.donationAmounts}>
          {[5, 10, 20, 50, 100].map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt)} // Set the selected amount
              className={`${styles.donationButton} ${
                amt === amount ? styles.donationButtonSelected : "" // Highlight selected button
              }`}
            >
              {amt}$
            </button>
          ))}
        </div>

        {/* Payment methods section */}
        <h3 className={styles.modalSubtitle}>Payment method:</h3>
        <div className={styles.paymentMethods}>
          {["MB WAY", "PayPal", "MasterCard"].map((method) => (
            <button
              key={method}
              onClick={() => setSelectedMethod(method)} // Set the selected payment method
              className={`${styles.paymentMethodButton} ${
                selectedMethod === method ? styles.paymentMethodSelected : "" // Highlight selected method
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        {/* Reward display for the donation */}
        <p className={styles.modalText}>
          With this donation you will receive <strong>{amount * 100}</strong> 🪙 {/* Dynamic reward */}
        </p>

        {/* Comment section */}
        <TextArea
          placeholder="Write a comment on your donation" // Placeholder text
          value={comment} // Current comment value
          onChange={(e) => setComment(e.target.value)} // Update comment state
          className={styles.textarea}
        />

        {/* Anonymous donation toggle */}
        <span>Do you want it to be an anonymous donation?</span>
        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              name="anonymous"
              checked={anonymous} // Selected if true
              onChange={() => setAnonymous(true)} // Set anonymous to true
            />
            YES
          </label>
          <label>
            <input
              type="radio"
              name="anonymous"
              checked={!anonymous} // Selected if false
              onChange={() => setAnonymous(false)} // Set anonymous to false
            />
            NO
          </label>
        </div>

        {/* Submit button for the donation */}
        <button
          onClick={() => {
            alert("Thank you for your donation!"); // Display a thank-you message
            onClose(); // Close the modal after submission
          }}
          className={styles.modalSubmit}
        >
          Donate Now
        </button>
      </div>
    </div>
  );
};

export default DonationModal;
