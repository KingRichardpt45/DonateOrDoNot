"use client";
import React, { useState } from "react";
import styles from "./sideProfile.module.css";

const SideProfile: React.FC<{ initialUser: any }> = ({ initialUser }) => {
  // Using useState to manage the editable fields
  const [user, setUser] = useState(initialUser);

  // Handler to update the user data when input fields change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser: any) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Handler for saving changes (you can integrate with backend/API here)
  const handleSaveChanges = () => {
    console.log("Saved changes:", user);
    alert("Your changes have been saved.");
  };

  return (
    <div className={styles.Sidebar}>
      <img
        src={user.profileImage}
        alt="Profile"
        className={styles.ProfileImage}
      />
      <div className={styles.UserInfo}>
        <h1 className={styles.h1}>
          <input
            type="text"
            name="first_name"
            value={user.first_name}
            onChange={handleInputChange}
            className={styles.InputField}
          />{" "}
          <input
            type="text"
            name="last_name"
            value={user.last_name}
            onChange={handleInputChange}
            className={styles.InputField}
          />
        </h1>
        <p className={styles.p}>
          Phone:{" "}
          <input
            type="text"
            name="phone_number"
            value={user.phone_number}
            onChange={handleInputChange}
            className={styles.InputField}
          />
        </p>
        <p>
          Email:{" "}
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            className={styles.InputField}
          />
        </p>
        <p>
          Address:{" "}
          <input
            type="text"
            name="address"
            value={user.address}
            onChange={handleInputChange}
            className={styles.InputField}
          />
        </p>
      </div>
      <button onClick={handleSaveChanges} className={styles.SaveButton}>
        Save Changes
      </button>
      <button className={styles.LogoutButton}>Logout</button>
      <button className={styles.DeleteButton}>Delete Account</button>
    </div>
  );
};

export default SideProfile;
