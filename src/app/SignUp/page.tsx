"use client";

import styles from "../components/authentication.module.css";
import SideMenu from "../components/SideMenu";
import { Header } from "../components/NavBarNotLogged";
import { useState } from "react";

export default function SignUp() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Handle checkbox role selection (Campaign Creator or Donor)
  const handleRoleChange = (role: string) => {
    if (selectedRole === role) {
      setSelectedRole(null); // Deselect if the same checkbox is clicked
    } else {
      setSelectedRole(role);
    }
  };

  // Handle select box change (Autonomous or Institution)
  const handleTypeChange = (role: string) => {
    if (selectedType === role) {
      setSelectedType(null); // Deselect if the same option is clicked
    } else {
      setSelectedType(role); // Set the selected option
    }
  };

  return (
    <div className={styles.page}>
      <Header />
      <SideMenu />
      <main className={styles.main}>
        <div className={styles.signUpContainer}>
          <h2 className={styles.heading}>Sign Up</h2>
          <form className={styles.signUpForm}>
            <input
              type="email"
              className={styles.inputField}
              placeholder="Email"
            />
            <input
              type="password"
              className={styles.inputField}
              placeholder="Password"
            />
            <input
              type="password"
              className={styles.inputField}
              placeholder="Confirm Password"
            />

            {/* Role checkboxes */}
            <div className={styles.checkboxContainer}>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="campaignCreator"
                  name="role"
                  value="campaignCreator"
                  checked={selectedRole === "campaignCreator"}
                  onChange={() => handleRoleChange("campaignCreator")}
                />
                <label
                  htmlFor="campaignCreator"
                  className={styles.checkboxLabel}
                >
                  Campaign Creator
                </label>
              </div>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="donor"
                  name="role"
                  value="donor"
                  checked={selectedRole === "donor"}
                  onChange={() => handleRoleChange("donor")}
                />
                <label htmlFor="donor" className={styles.checkboxLabel}>
                  Donor
                </label>
              </div>
            </div>

            {/* Additional fields if Campaign Creator is selected */}
            {selectedRole === "campaignCreator" && (
              <>
                <div className={styles.checkboxTypeContainer}>
                  <div className={styles.checkboxGroup}>
                    <input
                      type="checkbox"
                      id="autonomous"
                      name="type"
                      value="autonomous"
                      checked={selectedType === "autonomous"}
                      onChange={() => handleTypeChange("autonomous")}
                    />
                    <label htmlFor="autonomous" className={styles.checkboxLabel}>
                      Autonomous
                    </label>
                  </div>
                  <div className={styles.checkboxGroup}>
                    <input
                      type="checkbox"
                      id="institution"
                      name="type"
                      value="institution"
                      checked={selectedType === "institution"}
                      onChange={() => handleTypeChange("institution")}
                    />
                    <label htmlFor="institution" className={styles.checkboxLabel}>
                      Institution
                    </label>
                  </div>
                </div>

                {/* Display fields based on Autonomous or Institution */}
                {selectedType === "autonomous" && (
                  <>
                    <input
                      type="text"
                      className={styles.inputField}
                      placeholder="Username"
                    />
                    <input
                      type="text"
                      className={styles.inputField}
                      placeholder="Address"
                    />
                  </>
                )}

                {selectedType === "institution" && (
                  <>
                    <input
                      type="text"
                      className={styles.inputField}
                      placeholder="Institution Name"
                    />
                    <input
                      type="text"
                      className={styles.inputField}
                      placeholder="Address"
                    />
                  </>
                )}

                {/* Show Confirm Identity field only if Autonomous or Institution is selected */}
                {(selectedType === "autonomous" || selectedType === "institution") && (
                  <>
                    <label htmlFor="confirmIdentity" className={styles.fileLabel}>
                      Confirm Identity
                    </label>
                    <input
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
            {selectedRole === "donor" && (
              <input
                type="text"
                className={styles.inputField}
                placeholder="Username"
              />
            )}

            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
