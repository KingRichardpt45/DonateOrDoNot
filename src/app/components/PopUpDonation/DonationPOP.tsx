import styles from "./Modal.module.css";
import React, { useState } from "react";
import { TextArea } from "../textArea";

type DonationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState(18);
  const [selectedMethod, setSelectedMethod] = useState<string>(""); // Payment method
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

  if (!isOpen) return null;

  return (
    <div className={styles.modalWrapper}>
  <div className={styles.modalContent}>
  <button className={styles.modalClose} onClick={onClose}>
          &times;
        </button>
    <h2 className={styles.modalTitle}>How much do you want to donate?</h2>

    {/* Donation Input */}
    <div className={styles.inputContainer}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className={styles.input}
      />
      <span className={styles.currencySymbol}>$</span>
    </div>

    {/* Predefined Amounts */}
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

    {/* Payment Methods */}
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

    {/* Reward Section */}
    <p className={styles.modalText}>
      With this donation you will receive <strong>{amount * 100}</strong> 🪙
    </p>

    {/* Comment Section */}
    <TextArea
      placeholder="Write a comment on your donation"
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      className={styles.textarea}
    />

    {/* Anonymous Donation */}
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

    {/* Submit Button */}
    <button
      onClick={() => {
        alert("Thank you for your donation!");
        onClose(); // Close the modal
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
