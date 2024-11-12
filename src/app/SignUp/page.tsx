"use client";

import styles from "../components/authentication.module.css";
import SideMenu from "../components/SideMenu";
import { Header } from "../components/NavBarNotLogged";
import { useState } from "react";

export default function SignUp() {
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

  return (
    <div className={styles.page}>
      <Header />
      <SideMenu />
      <main className={styles.main}>
        <div className={styles.signContainer}>
          <h2 className={styles.heading}>Sign Up</h2>
          <form className={styles.signForm}>
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

            {/* Role selection dropdown */}
            <div className={styles.dropdownContainer}>
              <label htmlFor="role" className={styles.dropdownLabel}>
                Select Role
              </label>
              <select
                id="role"
                className={styles.dropdown}
                onChange={handleRoleChange}
                value={selectedRole || ""}
              >
                <option value="">-- Select Role --</option>
                <option value="campaignCreator">Campaign Creator</option>
                <option value="donor">Donor</option>
              </select>
            </div>

            {/* Additional fields if Campaign Creator is selected */}
            {selectedRole === "campaignCreator" && (
              <>
                <div className={styles.dropdownContainer}>
                  <label htmlFor="type" className={styles.dropdownLabel}>
                    Type
                  </label>
                  <select
                    id="type"
                    className={styles.dropdown}
                    onChange={handleTypeChange}
                    value={selectedType || ""}
                  >
                    <option value="">-- Select Type --</option>
                    <option value="autonomous">Autonomous</option>
                    <option value="institution">Institution</option>
                  </select>
                </div>

                {/* Fields for Autonomous */}
                {selectedType === "autonomous" && (
                  <>
                    <input
                      type="text"
                      className={styles.inputField}
                      placeholder="Username"
                    />
                    <div className={styles.addressContainer}>
                      <input
                        type="text"
                        className={styles.smallInputField}
                        placeholder="Postal Code"
                      />
                      <input
                        type="text"
                        className={styles.smallInputField}
                        placeholder="City"
                      />
                    </div>
                    <input
                      type="text"
                      className={styles.inputField}
                      placeholder="Address"
                    />
                    <input
                      type="text"
                      className={styles.inputField}
                      placeholder="Address Specification"
                    />
                  </>
                )}

                {/* Fields for Institution */}
                {selectedType === "institution" && (
                  <>
                    <input
                      type="text"
                      className={styles.inputField}
                      placeholder="Institution Name"
                    />
                    <div className={styles.addressContainer}>
                      <input
                        type="text"
                        className={styles.smallInputField}
                        placeholder="Postal Code"
                      />
                      <input
                        type="text"
                        className={styles.smallInputField}
                        placeholder="City"
                      />
                    </div>
                    <input
                      type="text"
                      className={styles.inputField}
                      placeholder="Address"
                    />
                    <input
                      type="text"
                      className={styles.inputField}
                      placeholder="Address Specification"
                    />
                  </>
                )}

                {/* Confirm Identity file upload for Autonomous and Institution */}
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

            <div className={styles.signLink}>
              I already have an account! <a href="/SignIn" className={styles.link}>Click Here!</a>
            </div>

            <button type="submit" className={styles.submitButton}>
              Sign Up
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
