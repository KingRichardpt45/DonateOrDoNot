import { User } from "@/models/User";
import styles from "./topDonors.module.css";
import { Donor } from "@/models/Donor";

type TopDonorsListProps = {
  podiumDonors: Donor[];
};

//To use this component is required to respect the type TopDonorsListProps
const TopDonors: React.FC<TopDonorsListProps> = ({ podiumDonors }) => {
  return (
    <div className={styles.TopDonorComponent}>
      <h1>Top Donors</h1>
      <div className={styles.TopDonorContainer}>
        {podiumDonors[3] && (
          <div className={styles.FourthTop}>
            <img
              src="/images/ProfileImageDefault.png"
              alt="Profile Image"
              width={100}
              height={100}
            />
            <h3>{(podiumDonors[3].user.value as User).first_name}</h3>
          </div>
        )}
        
        {podiumDonors[2] && (
          <div className={styles.ThreeTop}>
            <img
              src="/images/ProfileImageDefault.png"
              alt="Profile Image"
              width={100}
              height={100}
            />
            <h3>{(podiumDonors[2].user.value as User).first_name}</h3>
          </div>
        )}

        {podiumDonors[0] && (
          <div className={styles.FirstTop}>
            <img
              src="/images/ProfileImageDefault.png"
              alt="Profile Image"
              width={100}
              height={100}
            />
            <h3>{(podiumDonors[0].user.value as User).first_name}</h3>
          </div>
        )}

        {podiumDonors[1] && (
          <div className={styles.SecondTop}>
            <img
              src="/images/ProfileImageDefault.png"
              alt="Profile Image"
              width={100}
              height={100}
            />
            <h3>{(podiumDonors[1].user.value as User).first_name}</h3>
          </div>
        )}

        {podiumDonors[4] && (
          <div className={styles.FifthTop}>
            <img
              src="/images/ProfileImageDefault.png"
              alt="Profile Image"
              width={100}
              height={100}
            />
            <h3>{(podiumDonors[4].user.value as User).first_name}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopDonors;
