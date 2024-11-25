"use client"

import styles from "../../components/authentication.module.css";
import { useState } from "react";
import { ActionDisplay } from "@/app/components/actionsNotifications/actionDisplay/ActionDisplay";
import { CampaignManagerTypes } from "@/models/types/CampaignManagerTypes";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { IActionResultNotification } from "../actionsNotifications/IActionResultNotification";
import { ActionResultNotificationError } from "../actionsNotifications/ActionResultNotificationError";
import { ActionResultNotificationSuccess } from "../actionsNotifications/ActionResultNotificationSuccess";

export default function SignUpForm() 
{
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);
  
    // Handle role dropdown change (Campaign Creator or Donor)
    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const role = event.target.value;
      setSelectedRole(role ? role : null); // Set role or null if empty
      setSelectedType(null); // Reset type selection when role changes
    };
  
    // Handle type dropdown change (Autonomous or Institution)
    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const type = event.target.value;
      setSelectedType(type ? type : null); // Set type or null if empty
    };
  
    const [actionResults, setActionResults] = useState<IActionResultNotification[] >([]); 
    
    // Handle form submission
    const handleSubmit = async (event: React.FormEvent) => 
    {
      event.preventDefault(); // Prevent default form submission
  
      const formData = new FormData(event.target as HTMLFormElement); 
      setActionResults([]); 
  
        const response = await fetch("/api/account/signup", {
          method: "POST",
          body: formData,
        });

        switch(response.status)
        {
          case 200:
            const actionsNotificationsSuccess = [new ActionResultNotificationSuccess("Account create.",1000)];
            setActionResults(actionsNotificationsSuccess);
            setTimeout(() => {window.location.href = window.location.href.replace("signup","signin");}, 1000);
            return;
          case 422:
            const responseBody =  await response.json();
            let time = 5000;
            const actionsNotifications = [];
            for (const error of responseBody.errors) 
            {
              actionsNotifications.push( new ActionResultNotificationError(error.field,error.errors,time) );
              time += 1000;
            }
            setActionResults(actionsNotifications)
            break;
          default:
            alert(response.statusText);
            break
        }
    };
  
    return (
      <main className={styles.main}>
        { 
          actionResults.length > 0 &&
          (
            <ActionDisplay actions={actionResults} />
          )
        }
        <div className={styles.signContainer}>
          <h2 className={styles.heading}>Sign Up</h2>
          <form onSubmit={handleSubmit} className={styles.formContainer}>

            <div className={styles.columnsContainer} >

              <div className={styles.signForm} >

                <div className={styles.subFormTitle}  >
                  <h4>Account Credentials</h4>
                  <hr/>
                </div>
                <input
                  name="email"
                  type="email"
                  className={styles.inputField}
                  placeholder="Email"
                />
                <input
                  name="password"
                  type="password"
                  className={styles.inputField}
                  placeholder="Password"
                />
                <input
                  name="passwordConfirm"
                  type="password"
                  className={styles.inputField}
                  placeholder="Confirm Password"
                />

                <div className={styles.subFormTitle}  >
                  <h4>Billing Address</h4>
                  <hr/>
                </div>

                <div className={styles.addressContainer}>
                      <input
                        name="postalCode"
                        type="text"
                        className={styles.smallInputField}
                        placeholder="Postal Code"
                      />
                      <input
                        name="city"
                        type="text"
                        className={styles.smallInputField}
                        placeholder="City"
                      />
                    </div>
                    <input
                      name="address"
                      type="text"
                      className={styles.inputField}
                      placeholder="Address"
                    />
                    <input
                      name="addressSpecification"
                      type="text"
                      className={styles.inputField}
                      placeholder="Address Specification"
                    />
              </div>

              <div className={styles.signForm} >

                {/* Role selection dropdown */}
                <div className={styles.dropdownContainer}>
                  <div className={styles.subFormTitleSelect}  >
                    <h4>Account Type</h4>
                    <hr/>
                  </div>
                  <select
                    name="type"
                    id="type"
                    className={styles.dropdown}
                    onChange={handleRoleChange}
                    value={selectedRole || ""}
                  >
                    <option value="">-- Select Role --</option>
                    <option value={UserRoleTypes.CampaignManager}>Campaign Creator</option>
                    <option value={UserRoleTypes.Donor}>Donor</option>
                  </select>
                </div>

                {/* Additional fields if Campaign Creator is selected */}
                {selectedRole === `${UserRoleTypes.CampaignManager}` && (
                  <>
                    <div className={styles.dropdownContainer}>
                      <div className={styles.subFormTitleSelect}  >
                        <h4>Type</h4>
                        <hr/>
                      </div>
                      <select
                        name="managerType"
                        id="type"
                        className={styles.dropdown}
                        onChange={handleTypeChange}
                        value={selectedType || ""}
                      >
                        <option value="">-- Select Type --</option>
                        <option value={CampaignManagerTypes.Autonomous}>Autonomous</option>
                        <option value={CampaignManagerTypes.Institution}>Institution</option>
                      </select>
                    </div>

                    {/* Fields for Autonomous */}
                    {selectedType === `${CampaignManagerTypes.Autonomous}` && (
                      <>
                        <input
                          name="name"
                          type="text"
                          className={styles.inputField}
                          placeholder="Full Name"
                        />
                      </>
                    )}

                    {/* Fields for Institution */}
                    {selectedType === `${CampaignManagerTypes.Institution}` && (
                      <>
                        <input
                          name="name"
                          type="text"
                          className={styles.inputField}
                          placeholder="Institution Name"
                        />
                      </>
                    )}

                    {/* Confirm Identity file upload for Autonomous and Institution */}
                    {(selectedType === `${CampaignManagerTypes.Autonomous}` || selectedType === `${CampaignManagerTypes.Institution}`) && (
                      <>
                        <input
                          name="description"
                          type="textbox"
                          className={styles.inputField}
                          placeholder="description"
                        />
                        <input
                          name="contactEmail"
                          type="email"
                          className={styles.inputField}
                          placeholder="Contact email"
                        />
                        <div className={styles.subFormTitle}  >
                          <h4>Confirm Identity</h4>
                          <hr/>
                        </div>
                        <input
                          name="identificationFile"
                          type="file"
                          className={styles.fileInput}
                          accept="image/*, .pdf"
                          id="confirmIdentity"
                        />
                      </>
                    )}
                  </>
                )}

                {/* Display Username for Donor */}
                {selectedRole === `${UserRoleTypes.Donor}` && (
                  <>
                    <input
                      name="name"
                      type="text"
                      className={styles.inputField}
                      placeholder="Full Name"
                    />
                  </>
                )}
              </div>
            </div>

            <div className={styles.signLink}>
              I already have an account! <a href="/signin" className={styles.link}>Click Here!</a>
            </div>
            
            <div className={styles.centerContent}>
              <button type="submit" className={styles.submitButton}>
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }
  