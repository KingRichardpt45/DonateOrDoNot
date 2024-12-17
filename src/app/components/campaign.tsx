"use client";
import { useRef, useState} from "react";
import styles from "./components.module.css";
import Carousel from "./carousell"; // Importa o novo component


const  HomeContent:React.FC<{isAuthorized:boolean}> = ({isAuthorized}) => {
  
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false); // State for modal visibility
  const actualId = useRef<number>(0);
  
  function onActualIdChange(index:number)
  {
    actualId.current = index;
  }

  function onClickDonate()
  {
    window.location.href = `/campaigns/view/${actualId.current}`; 
  }

  function onClickSignUp()
  {
    window.location.href = `/signup`; 
  }

  return (
    <div style={{flexGrow:1,width:"100%"}}>
      <section className={styles.campaign}>
      <Carousel onActualIdChange={onActualIdChange} />
        <div className={styles.bottomOverlay}>
           { isAuthorized && 
            <>
              <p>Be one of this campaign's top Donors!</p>
              <button
                className={styles.donateNowButton}
                onClick={() => onClickDonate() } 
                >
                Donate Now
              </button>
            </>
           }
           { !isAuthorized && 
            <>
              <p>Let your heart Grow, filing it with joy by Donating Now!</p>
              <button
                className={styles.donateNowButton}
                onClick={() => onClickSignUp() } 
                >
                Sign Up 
              </button>
            </>
           }
        </div>
      </section>
    </div>
  );
}


export default HomeContent;