

import Image from "next/image"; // Used for optimized image rendering in Next.js
import { ExpandableSearchBar } from "../components/searchBar"; // Importing the search bar component
import styles from "./search.module.css"; // CSS module for styling
import Campaign from "../components/campaign"; // Campaign component
import { HeaderL } from "../components/NavBarLogged";
import Link from "next/link";
import DonationModalClient from "./donateM";
import { MainLayout } from "../components/coreComponents/mainLayout";
import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import NotAuthorized from "../components/authorization/notAuthorized";
import NotLoggedIn from "../components/authorization/notLogged";
import { User } from "@/models/User";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";


const userProvider = Services.getInstance().get<IUserProvider>("IUserProvider");

export default async function Home() {
  const user = await userProvider.getUser();
  const authorized = user !== null && (user as User).type == UserRoleTypes.Donor;
  // Default campaigns array used for testing or displaying sample data
  const defaultCampaigns = [
    {
      title: "Donate Blood & Save a Life", // Campaign title
      image: "/images/Elephant.png", // Image path for the campaign
    },
    {
      title: "Food Drive",
      image: "/images/hunger.png",
    },
    {
      title: "Puppy Paw Donation Drive",
      image: "/images/hunger.png",
    },
    {
      title: "Hope for Orphans",
      image: "/images/Elephant.png",
    },
    {
      title: "Football Fundraiser",
      image: "/images/Elephant.png",
    },
  ];

  return (
        <MainLayout passUser={user}>
      {
        user === null &&
        <NotLoggedIn/>
      }
      {
        !authorized &&
        <NotAuthorized/>
      }
      {
        authorized &&
          <><ExpandableSearchBar /><Campaign /><div className={styles.container}>
          <div className={styles.campaignContainer}>
            <h2 className={styles.heading}>Other Campaigns</h2>
            {/* List of campaigns rendered dynamically from defaultCampaigns */}
            <div className={styles.campaignList}>
              {defaultCampaigns.map((campaign, index) => (
                <div key={index} className={styles.campaignCard}>
                  <Link href={"/campaignpage"}>
                    {" "}
                    {/* Link para a campanha */}
                    <a>
                      <Image
                        src={campaign.image} // Campaign image
                        alt={campaign.title} // Alt text for accessibility
                        width={180} // Fixed width
                        height={100} // Fixed height
                        className={styles.image} // Style for the image
                      />
                    </a>
                  </Link>
                  <h3 className={styles.title}>{campaign.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div></>
        }
        </MainLayout>
  );
}
