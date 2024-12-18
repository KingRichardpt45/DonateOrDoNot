import {Donor} from "@/models/Donor";
import styles from "./TopDonorsList.module.css";
import {User} from "@/models/User";

type TopDonorsListProps = {
  index: number;
  donor:Donor;
}

//To use this component is required to respect the type TopDonorListProps
const TopFrequentList: React.FC<TopDonorsListProps> = ({donor, index }) => {

  const getBackgroundColor = (index: number): string => {
    switch (index) {
      case 1:
        return "rgb(158, 123, 46)";
      case 2:
        return "rgb(128, 128, 128)";
      case 3:
        return "rgb(80, 50, 23)";
      default:
        return "rgb(0, 59, 107)";
    }
  };

  //GET USER IMAGE!!
  return (
    <div className={styles.TopDonorsListComponent}>
      <div
      className={styles.topDonorsListContainer}
      style={{ backgroundColor: getBackgroundColor(index) }}
      >
        <div className={styles.donorImage}>
          {/* ADD USER IMAGE */}
          <img src="/images/ProfileImageDefault.png" alt="Profile Image" width={100} height={100}/>
        </div>
        <div className={styles.donorPosition}>
          {index}
        </div>
        <div className={styles.donorName}>
          {(donor.user.value as User).first_name}
        </div>
        <div className={styles.donorAmount}>
          {donor.frequency_of_donation}
        </div>
      </div>
    </div>
  );
};

export default TopFrequentList;