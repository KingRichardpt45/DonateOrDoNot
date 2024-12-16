"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./components.module.css"; // Crie um arquivo CSS para o carrossel, ou ajuste a importação de estilos existente
import { Campaign } from "@/models/Campaign";
import { FileTypes } from "@/models/types/FileTypes";
import {File as ModelFile} from "@/models/File";
import Image from 'next/image';


const Carousel: React.FC<{}> = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  //const [mainImageID,setMainImagesID] = useState<ModelFile[]>([]);

  const [tops,setTopCampaign] = useState<{MainImagesArray:ModelFile[],campains:Campaign[]}>({MainImagesArray:[],campains:[]});

  const nextItem = () => {
    if (tops.MainImagesArray.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % tops.MainImagesArray.length);
    }
  };
  
  const prevItem = () => {
    if (tops.MainImagesArray.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + tops.MainImagesArray.length) % tops.MainImagesArray.length);
    }
  };

  useEffect(() => 
  { 
    fetch("/api/campaign/top",{method:"GET"}).then(
      async (response)=>{
        if (response.ok){
          const bodyData = await response.json() as {data:Campaign[]};
          const topCampaigns = bodyData.data;
          const mainImageID:ModelFile[]=[];
          for (const campaign of topCampaigns) {
            for (const file of campaign.files.value as ModelFile[]) {
              if(file.file_type==FileTypes.MainImage){
                mainImageID.push(file);
              }
            }
          }
          setTopCampaign({MainImagesArray:mainImageID,campains:topCampaigns});
        }
      }
    );

    const interval = setInterval(nextItem, 3000);
    return () => clearInterval(interval);
  }, []); 
    
    return (
      <div className={styles.carousel}>
      {/* Indicators */}
      <div className={styles.indicators}>
        {tops.MainImagesArray.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${currentIndex === index ? styles.activeDot : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>

      {/* Navigation buttons */}
      <button className={styles.navButton} onClick={prevItem}>
        &lt;
      </button>
      <div
        className={styles.imageTrain}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {tops.MainImagesArray.map((file:ModelFile, index) => (
          // <img key={index} src={`/public/documents/${file.id}_${file.original_name}`} alt={file.original_name!} />)
          <Image 
              key={index}
              src={`/documents/${file.id}_${file.original_name}`}
              alt={file.original_name!}
              width={1000}
              height={1000}
              />
        ))}
      </div>
      <button className={styles.navButton} onClick={nextItem}>
        &gt;
      </button>
      {/* Overlay content */}
      <div className={styles.overlay}>
        <h2 className={styles.title}>{tops.campains[currentIndex]?.title}</h2>
        <p className={styles.description}>{tops.campains[currentIndex]?.description}</p>
        <div className={styles.donationGoals}>
          {/* <p> Current Progress {tops.campains[currentIndex]?.current_donation_value}</p> */}
          {/* {tops.campains.map((campaign, index) => (
            <p key={index}>{campaign.current_donation_value}</p>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default Carousel;