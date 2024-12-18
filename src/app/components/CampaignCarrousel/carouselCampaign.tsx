"use client";
import React, {useState} from "react";
import styles from "./carouselCampaign.module.css"; // Crie um arquivo CSS para o carrossel, ou ajuste a importação de estilos existente
import {Campaign} from "@/models/Campaign";
import {FileTypes} from "@/models/types/FileTypes";
import {File as ModelFile} from "@/models/File";
import Image from 'next/image';


const CarouselCampaign: React.FC<{campaign:Campaign}> = ({campaign}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

const mainImageID:ModelFile=(campaign.files.value as ModelFile[]).find((file)=>file.file_type==FileTypes.MainImage)!;
   
    return (
      <div className={styles.carousel}>
      <div className={styles.imageTrain}>
        
          <Image 
              src={`/documents/${mainImageID.id}_${mainImageID.original_name}`}
              alt={mainImageID.original_name!}
              width={1000}
              height={1000}
              />
              <div className={styles.overlay}>

        <h2 className={styles.title}>{campaign?.title}</h2>
        <p className={styles.description}>{campaign?.description}</p>
        <div className={styles.donationGoals}>
                </div>
        </div>
      </div>
      {/* Overlay content */}

    
    </div>
  );
};

export default CarouselCampaign;