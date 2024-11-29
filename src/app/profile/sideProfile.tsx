"use server";
import { DonorManager } from "@/core/managers/DonorManager";
import styles from "./sideProfile.module.css";
import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";

const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");

const SideProfile = async () => {
  const user = await userProvider.getUser();
  
  return (
    <div className={styles.Sidebar}>
      <img
        src={""}
        alt="Profile"
        className={styles.ProfileImage}
      />
      <div className={styles.UserInfo}>
        <h1 className={styles.h1}>
          {user?.first_name} {user?.last_name}
        </h1>
        <p>Email: {user?.email}</p>
        <p>Address: {}</p>
      </div>
      <form action="/api/save-profile" method="POST" className={styles.Form}>
        <input type="hidden" name="userId" value={user?.id!} />
        <input
          type="text"
          name="first_name"
          defaultValue={user?.first_name!}
          className={styles.InputField}
        />
        <input
          type="text"
          name="last_name"
          defaultValue={user?.last_name!}
          className={styles.InputField}
        />
        <input
          type="email"
          name="email"
          defaultValue={user?.email!}
          className={styles.InputField}
        />
        <input
          type="text"
          name="address"
          defaultValue={"Hello"}
          className={styles.InputField}
        />
        <button type="submit" className={styles.SaveButton}>
          Save Changes
        </button>
      </form>
      <form action="/logout" method="POST" className={styles.Form}>
        <button type="submit" className={styles.LogoutButton}>
          Logout
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
