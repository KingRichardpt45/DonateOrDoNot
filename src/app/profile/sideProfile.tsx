"use server";
import { DonorManager } from "@/core/managers/DonorManager";
import styles from "./sideProfile.module.css";
import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import {File as ModelFile} from "@/models/File";
const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");
const SideProfile = async () => {
  const user = await userProvider.getUser();
  
  return (
    <div className={styles.Sidebar}>
   <img
  src={`/documents/${user?.profile_image_id}_${
                (user?.profileImage.value as ModelFile).original_name
              }`
    
  }
  alt={`${user?.first_name ?? "User"} ${user?.last_name ?? ""}`}
  className={styles.ProfileImage}
/>

  
      <div className={styles.UserInfo}>
        <h1 className={styles.h1}>
          {user?.first_name} {user?.last_name}
        </h1>
        <p>Email: {user?.email}</p>
        <p>
  Address: {Array.isArray(user?.address?.value)
    ? user.address.value.map((addr) => `${addr.address}, ${addr.city}, ${addr.postal_code}`).join(" | ")
    : user?.address?.value 
      ? `${user.address.value.address}, ${user.address.value.city}, ${user.address.value.postal_code}` 
      : "Not provided"}
</p>



        

      </div>
      <form action="/api/save-profile" method="POST" className={styles.Form}>
  <input type="hidden" name="userId" value={user?.id!} />

  <label htmlFor="full_name" className={styles.Label}>Full Name</label>
  <input
    id="full_name"
    type="text"
    name="full_name"
    defaultValue={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()}
    className={styles.InputField}
  />

  <label htmlFor="email" className={styles.Label}>Email</label>
  <input
    id="email"
    type="email"
    name="email"
    defaultValue={user?.email!}
    className={styles.InputField}
  />

  <label htmlFor="address" className={styles.Label}>Address</label>
  <input
    id="address"
    type="text"
    name="address"
    defaultValue={
      user?.address?.value
        ? Array.isArray(user.address.value)
          ? user.address.value.map((addr) => `${addr.address}, ${addr.city}, ${addr.postal_code}`).join(" | ")
          : `${user.address.value.address}, ${user.address.value.city}, ${user.address.value.postal_code}`
        : ""
    }
    className={styles.InputField}
  />

  <button type="submit" className={styles.SaveButton}>
    Save Changes
  </button>
</form>
      <form action="/api/delete-account" method="POST" className={styles.Form}>
        <input type="hidden" name="userId" value={user?.id!} />
        <button type="submit" className={styles.DeleteButton}>
          Delete Account
        </button>
      </form>
    </div>
  );
};

export default SideProfile;
