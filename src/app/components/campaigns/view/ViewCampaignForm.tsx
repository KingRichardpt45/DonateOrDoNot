"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./ViewCampaignForm.module.css";
import { Campaign } from "@/models/Campaign";

import DropdownInput from "../../search/selectWithInput/selectWithInput";
import { BadgeTypes } from "@/models/types/BadgeTypes";
import { FileTypes } from "@/models/types/FileTypes";
import { IActionResultNotification } from "../../actionsNotifications/IActionResultNotification";
import { ActionDisplay } from "../../actionsNotifications/actionDisplay/ActionDisplay";
import { File as ModelFIle} from "@/models/File";
import { Badge } from "@/models/Badge";
import { CampaignBadge } from "@/models/CampaignBadge";
import { BankAccount } from "@/models/BankAccount";
import { array } from "yup";
import { StringUtils } from "@/core/utils/StringUtils";
import { ActionResultNotificationError } from "../../actionsNotifications/ActionResultNotificationError";
import { ActionResultNotificationSuccess } from "../../actionsNotifications/ActionResultNotificationSuccess";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { CampaignStatus } from "@/models/types/CampaignStatus";
import CarouselCampaign from "../../CampaignCarrousel/carouselCampaign";

interface AddedFile
{ 
  type:FileTypes,
  file:File 
}

enum FieldEntitiesTypes
{
  BANK,
  CAMPAIGN,
  BADGE,
}

interface FormsData 
{ 
  campaignFormData:FormData , 
  bankForm:FormData ,
  badgeFamilyFormData:FormData ,
  badgeHelperFormData:FormData ,
  badgePartnerFormData:FormData ,
}

const ViewCampaignForm :React.FC<{campaign:Campaign}> = ({campaign}) =>{

    const [ firstRender, setFirstRender ] = useState<boolean>(true);
    const [ render,setRender] = useState<number>(0);
    const [submitted, setSubmitted] =  useState<boolean>(false);

    const [ updatedFields, setUpdatedFields ] = useState<Map<string,{type:FieldEntitiesTypes,value:string,badgeType:BadgeTypes|null}>>(new Map<string,any>());
    const [ fieldsValue, setFieldsValue ] = useState<Map<string,string>>(new Map<string,string>());
    const [ removedFiles, setRemovedFiles ] = useState<ModelFIle[]>([]);

    const [images, setImages] = useState<ModelFIle[]>([]);
    const [videos, setVideos] = useState<ModelFIle[]>([]);
    const [files, setFiles] = useState<ModelFIle[]>([]);
    const [mainImage, setMainImage] = useState<ModelFIle[]>([]);
  
    const [imagesAdded, setImagesAdded] = useState<Map<string,File>>(new Map<string,File>());
    const [videosAdded, setVideosAdded] = useState<Map<string,File>>(new Map<string,File>());
    const [filesAdded, setFilesAdded] = useState<Map<string,File>>(new Map<string,File>());
    const [mainImageAdded, setMainImageAdded] = useState<File | null>();


    if(firstRender)
        {
          for (const key of (new Campaign).getKeys()) 
          { 
            if( key === "end_date")
              fieldsValue.set(key,new Date(campaign[key]!).toISOString().split('T')[0] );
            else
              fieldsValue.set(key,campaign[key] as string);
          }
      
          //adicionar se for preciso badges
          /*for (const campaignBadge of campaign.badges.value as CampaignBadge[]) 
          {  
              const type = (campaignBadge.badge.value as Badge).type
              fieldsValue.set(`${type}_name`,((campaignBadge.badge.value as Badge).name!));
              fieldsValue.set(`${type}_description`,((campaignBadge.badge.value as Badge).description!));
          }*/
      
          for (const modelFile of campaign.files.value as ModelFIle[] ) 
          {
            switch (modelFile.file_type) 
           {
              case FileTypes.Document:
                files.push(modelFile);
                break;
              case FileTypes.Image:
                images.push(modelFile);
                break;
              case FileTypes.MainImage:
                mainImage.push(modelFile);
                break;
              case FileTypes.Video:
                videos.push(modelFile);
                break;
      
            }
          }
      
          setFirstRender(false);
        }


  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ type: "", src: "", alt: "" });
  
  const [currentAmount, setCurrentAmount] = useState(campaign.current_donation_value);

  const [goal, setGoal] = useState(campaign.objective_value);
  const progressPercentage = Math.min((currentAmount! / goal!) * 100, 100);

  const getProgressColor = (progressPercentage: number) => {
    if (progressPercentage < 20) return "red";
    if (progressPercentage < 50) return "yellow";
    return "green";
  };

  const progressColor = getProgressColor(progressPercentage);

  const handleImageClick = (doc: React.SetStateAction<{ type: string; src: string; alt: string; }>) => {
    setModalContent(doc);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
        <div>
            {/*adicionar a chamada do carrousel*/}
            <CarouselCampaign campaign={ campaign as Campaign} />

        <div className={styles.container}>
            <div className={styles.campaignContainer}>
            <div className={styles.progressContainer}>
              <span className={styles.progressText}>{Math.round(progressPercentage)}%</span>
              <span className={styles.progressTextRight}>
                {currentAmount}€/{goal}€
              </span>
              <div className={styles.progressBar}>
                <div
                  className={styles.progress}
                  style={{
                    width: `${progressPercentage}%`,
                    backgroundColor: progressColor,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.fileFormTitle}><b>Campaign Images</b></div>
        <div className={styles.filePreviewContainer}>
        {images.map((image, index) => (
            <div className={styles.galleryItem} key={index}>
                <Image
                    src={`/documents/${image.id}_${image.original_name}`}
                    alt={`Preview`}
                    width={250}
                    height={250}
                    className={styles.mainImage}
                    onClick={() => handleImageClick({
                        type: "image",
                        src: `/documents/${image.id}_${image.original_name}`,
                        alt: `Preview of ${image.original_name}`,
                    })}
                />
            </div>
        ))}
        </div>

        <div className={styles.fileFormTitle}><b>Campaign Videos</b></div>
        <div className={styles.filePreviewContainer}>
        {videos.map((video, index) => (
          <div key={index} className={styles.videoPreview}>
            <video
                controls
                className={styles.previewVideo}
                >
                <source src={`/documents/${video.id}_${video.original_name}`} type={video.file_suffix!} />
                Your browser does not support the video tag.
            </video>
            </div>
        ))}
        </div>

        <div className={styles.fileForm}>
        <div className={styles.fileFormTitle}><b>Campaign Files</b></div>
        </div>
        <div className={styles.filePreviewContainer}>
        {files.map((file, index) => (
          <div key={index} className={styles.filePreview}>
            {
              <object data={`/documents/${file.id}_${file.original_name}`} type="application/pdf" width="100%" height="200">
                <p>Your browser does not support PDFs. <a href={`/documents/${file.id}_${file.original_name}`}>Download the PDF</a>.</p>
              </object>
              
            }
          </div>
        ))}
        </div>

        {/* Modal for image preview */}
        {modalOpen && (
          <div className={styles.modal} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              {modalContent.type === "image" && (
                <Image
                  src={modalContent.src}
                  alt={modalContent.alt}
                  width={500}
                  height={500}
                  className={styles.modalImage}
                />
              )}
              <button className={styles.closeButton} onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        )}
        </div>
  );
}

export default ViewCampaignForm;