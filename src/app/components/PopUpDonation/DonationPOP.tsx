"use client"
import React, { useRef, useState } from "react"; // Import React and hooks
import styles from "./Modal.module.css"; // Import CSS module for styling
import { TextArea } from "../textArea"; // Import the TextArea component
import { ActionDisplay } from "../actionsNotifications/actionDisplay/ActionDisplay";
import { IActionResultNotification } from "../actionsNotifications/IActionResultNotification";
import { ActionResultErrorComponent } from "../actionsNotifications/actionResultError/ActionResultError";
import { ActionResultNotificationError } from "../actionsNotifications/ActionResultNotificationError";

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
  const [render,setRender] = useState(0);
  const amount = useRef(0); // State for donation amount
  const selectedMethod  = useRef<string>(""); // State for selected payment method
  const anonymous  = useRef<boolean>(false); // State for anonymous donation
  const comment  = useRef<string>(""); // State for user comment
 // const [isLoading, setIsLoading] = useState(false); // State for loading status
  const errorMessage  = useRef<string | null>(null); // State for error messages
  const successMessage  = useRef<string | null>(null); // State for success message
  const [actions,setActions] = useState<IActionResultNotification[]>([]);

  // Function to handle donation submission
  const handleDonate = async () => {
   
    
    try {
      setActions([]);
      const formData = new FormData();
      formData.append("campaign_id", campaignId.toString() );
      formData.append("donor_id", donorId.toString());
      formData.append("comment", comment.current.trim());
      formData.append("value", amount.current.toString());
      formData.append("nameHidden", anonymous.current ? "true" : "false");
      
      errorMessage.current = null;
      successMessage.current= "";

      fetch("/api/donations",  { method: "PUT", body: formData })
        .then(
          async (response)=>{

            if (response.ok) {
              const data = await response.json();
              selectedMethod.current= "";
              comment.current = ""
              amount.current = 0
              onClose();
            } else {
              const resultsErrors = await response.json();
              let time = 1000;
              const actions = [];
              for (const item of resultsErrors.errors) {
                actions.push(new ActionResultNotificationError(item.field,item.errors,time+=1000))
              }
              setActions(actions);
            }

          }
        )

    } catch (error) {
      errorMessage.current="An error occurred. Please try again.";

    } finally {
      
    }
  };

  // Early return if the modal is not open
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modalWrapper}>
        <div className={styles.modalContent}>
          
          <button className={styles.modalClose} onClick={ () => { onClose()}}>
            &times;
          </button>
          <h2 className={styles.modalTitle}>How much do you want to donate?</h2>
          <div className={styles.inputContainer}>
          
          { 
            actions.length > 0 &&
            (
                <ActionDisplay actions={actions} />
            )
          }
          
            <input
              type="number"
              value={amount.current}
              onChange={(e) => {amount.current =Number(e.target.value); setRender(render+1); }}
              className={styles.input}
            />
            <span className={styles.currencySymbol}>$</span>
          </div>
          <div className={styles.donationAmounts}>
            {[5, 10, 20, 50, 100].map((amt) => (
              <button
                key={amt}
                onClick={() => {amount.current=amt; setRender(render+1);} }
                className={`${styles.donationButton} ${
                  amt === amount.current ? styles.donationButtonSelected : ""
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
                onClick={() => {selectedMethod.current = method; setRender(render-1)} }
                className={`${styles.paymentMethodButton} ${
                  selectedMethod.current === method ? styles.paymentMethodSelected : ""
                }`}
              >
                {method}
              </button>
            ))}
          </div>
          <p className={styles.modalText}>
            With this donation you will receive <strong>{amount.current * 100} </strong> 
            <img src="/images/donacoin.png" alt="Dona Coin" width={15} height={15}/>
          </p>
          <TextArea
            placeholder="Write a comment on your donation"
            value={comment.current}
            onChange={(e) => {comment.current=e.target.value; setRender(render-1)}}
            className={styles.textarea}
          />
          <span>Do you want it to be an anonymous donation?</span>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="anonymous"
                checked={anonymous.current}
                onChange={() => { anonymous.current=true; setRender(render+1)}}
              />
              YES
            </label>
            <label>
              <input
                type="radio"
                name="anonymous"
                checked={!anonymous}
                onChange={() => { anonymous.current=false; setRender(render+1)} }
              />
              NO
            </label>
          </div>
          {errorMessage && <p className={styles.error}>{errorMessage.current}</p>}
          {successMessage && <p className={styles.success}>{successMessage.current}</p>}
          <button
            onClick={handleDonate}
            className={styles.modalSubmit}
           // disabled={isLoading || !selectedMethod}
          >
            "Donate"
          </button>
        </div>
      </div>
    </>
  );
};

export default DonationModal;
