'use client'
import styles from "./sideProfile.module.css";
import React from "react";

type EditProfileParams = {
    userId: number | null;
    profileImage: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    address: string | null;
    city: string | null;
    postalCode: string | null;
    fullAddress: string | null;
};

const ProfileSideBar = (params: EditProfileParams) => {

    const handleProfileChange = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        fetch(`/api/account/${params.userId}`, {
            method: "PATCH", body: formData,
        }).then((response) => {
            if (response.ok) {
                alert("Profile updated successfully");
            } else {
                alert("Failed to update profile");
            }
        });
    }

    return (<div className={styles.Sidebar}>
        <img
            src={params.profileImage ?? "/images/ProfileImageDefault.png"}
            alt={`${params.firstName ?? "User"} ${params.lastName ?? ""}`}
            className={styles.ProfileImage}
        />

        <div className={styles.UserInfo}>
            <h1 className={styles.h1}>{params.firstName} {params.lastName}</h1>
            <p>Email: {params.email}</p>
            <p>Address: {params.fullAddress}</p>
        </div>

        <form onSubmit={handleProfileChange} className={styles.Form}>
            <label htmlFor="first_name" className={styles.Label}>First Name</label>
            <input
                id="first_name"
                type="text"
                name="first_name"
                defaultValue={`${params.firstName ?? ""}`.trim()}
                className={styles.InputField}
            />

            <label htmlFor="last_name" className={styles.Label}>Last Name</label>
            <input
                id="last_name"
                type="text"
                name="last_name"
                defaultValue={`${params.lastName ?? ""}`.trim()}
                className={styles.InputField}
            />

            <label htmlFor="email" className={styles.Label}>Email</label>
            <input
                id="email"
                type="email"
                name="email"
                defaultValue={params.email ?? ""}
                className={styles.InputField}
            />

            <label htmlFor="address" className={styles.Label}>Address</label>
            <input
                id="address"
                type="text"
                name="address"
                defaultValue={params.address ?? ""}
                className={styles.InputField}
            />

            <label htmlFor="city" className={styles.Label}>City</label>
            <input
                id="city"
                type="text"
                name="city"
                defaultValue={params.city ?? ""}
                className={styles.InputField}
            />

            <label htmlFor="postal_code" className={styles.Label}>Postal Code</label>
            <input
                id="postal_code"
                type="text"
                name="postal_code"
                defaultValue={params.postalCode ?? ""}
                className={styles.InputField}
            />

            <button type="submit" className={styles.SaveButton}>
                Save Changes
            </button>
        </form>
        <form action="/api/delete-account" method="POST" className={styles.Form}>
            <input type="hidden" name="userId" value={params.userId ?? 0}/>
            <button type="submit" className={styles.DeleteButton}>
                Delete Account
            </button>
        </form>
    </div>);
};

export default ProfileSideBar;
