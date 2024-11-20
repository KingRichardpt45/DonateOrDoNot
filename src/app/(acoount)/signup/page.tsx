"use client";

import styles from "../../components/authentication.module.css";
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

  // Handle form submission
  const [error, setError] = useState<string | null>(null); // For error handling
  const [loading, setLoading] = useState(false); // For loading state
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const formData = new FormData(event.target as HTMLFormElement);

    setLoading(true); // Set loading state to true
    setError(null); // Reset error state

    try {
      // Send the form data to the API endpoint using fetch
      const response = await fetch("/api/account/signup", {
        method: "POST",
        body: formData,
      });

      console.log(response);

      if (!response.ok) {
        // If the response status is not ok, throw an error
        const errorData = await response.json();
        setError(errorData?.error || "Something went wrong.");
      } else {
        // Handle success (e.g., redirect to another page or show success message)
        const result = await response.json();
        if (result.redirect) {
          // If there's a redirect in the response, redirect the user
          window.location.href = result.redirect;
        } else {
          // Or handle other successful responses
          alert("Account created successfully!");
        }
      }
    } catch (err) {
      // Catch any errors during fetch and set the error message
      setError("An error occurred during submission.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.signContainer}>
          <h2 className={styles.heading}>Sign Up</h2>
          <form onSubmit={handleSubmit} className={styles.signForm}>
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

            {/* Role selection dropdown */}
            <div className={styles.dropdownContainer}>
              <label htmlFor="type" className={styles.dropdownLabel}>
                Select Role
              </label>
              <select
                name="type"
                id="type"
                className={styles.dropdown}
                onChange={handleRoleChange}
                value={selectedRole || ""}
              >
                <option value="">-- Select Role --</option>
                <option value="CampaignManager">Campaign Creator</option>
                <option value="Donor">Donor</option>
              </select>
            </div>

            {/* Additional fields if Campaign Creator is selected */}
            {selectedRole === "CampaignManager" && (
              <>
                <div className={styles.dropdownContainer}>
                  <label htmlFor="type" className={styles.dropdownLabel}>
                    Type
                  </label>
                  <select
                    name="managerType"
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
                      name="name"
                      type="text"
                      className={styles.inputField}
                      placeholder="Full Name"
                    />
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
                  </>
                )}

                {/* Fields for Institution */}
                {selectedType === "institution" && (
                  <>
                    <input
                      name="name"
                      type="text"
                      className={styles.inputField}
                      placeholder="Institution Name"
                    />
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
                  </>
                )}

                {/* Confirm Identity file upload for Autonomous and Institution */}
                {(selectedType === "autonomous" || selectedType === "institution") && (
                  <>
                    <label htmlFor="confirmIdentity" className={styles.fileLabel}>
                      Confirm Identity
                    </label>
                    <input
                      name="file"
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
            {selectedRole === "Donor" && (
              <>
                <input
                  name="name"
                  type="text"
                  className={styles.inputField}
                  placeholder="Full Name"
                />
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
              </>
            )}

            <div className={styles.signLink}>
              I already have an account! <a href="/signin" className={styles.link}>Click Here!</a>
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
              Sign Up
            </button>

            
            {
              error && <p className={styles.error}>{error}</p>
              //for Testes.
            }
            
          </form>
        </div>
      </main>
    </div>
  );
}
