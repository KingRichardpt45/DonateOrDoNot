"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./ViewCampaignForm.module.css";
import {Campaign} from "@/models/Campaign";
import {BadgeTypes} from "@/models/types/BadgeTypes";
import {FileTypes} from "@/models/types/FileTypes";
import {File as ModelFIle} from "@/models/File";
import CarouselCampaign from "../../CampaignCarrousel/carouselCampaign";
import TopDonors from "../../topDonors/topDonors";
import {Donor} from "@/models/Donor";
import DonationModal from "../../PopUpDonation/DonationPOP";
import { IRoomHubClientConnection } from "@/services/hubs/IRoomHubClientConnections";
import { useConnectionContext } from "../../coreComponents/ioConnectionProvider";
import { RoomIdGenerator } from "@/services/hubs/notificationHub/RoomIdGenerator";
import { CampaignNewDonation } from "@/services/hubs/events/CampaignNewDonation";
import { IHubEvent } from "@/services/hubs/IHubEvent";
import { IActionResultNotification } from "../../actionsNotifications/IActionResultNotification";
import { ActionResultNotificationSuccess } from "../../actionsNotifications/ActionResultNotificationSuccess";
import { ActionDisplay } from "../../actionsNotifications/actionDisplay/ActionDisplay";


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



const ViewCampaignForm :React.FC<{campaign:Campaign, topDonors: Donor[], donorId:number}> = ({campaign, topDonors,donorId}) =>{

  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false); // State for modal visibility

    const firstRender = useRef<boolean>(true);
    const firstRender2 = useRef<boolean>(true);
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
    const [actions,setActions] = useState<IActionResultNotification[]>([]);

    const hubConnection = useRef<IRoomHubClientConnection | null>(null);
    const test = useRef("data")

    if(firstRender2.current)
    {
      for (const key of (new Campaign).getKeys()) 
      { 
        if( key === "end_date")
          fieldsValue.set(key,new Date(campaign[key]!).toISOString().split('T')[0] );
        else
          fieldsValue.set(key,campaign[key] as string);
      }
    
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
      
     
      firstRender2.current = false;
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

  if (typeof window !== "undefined" && firstRender.current) 
  {
    console.log("new Donations hub");
    hubConnection.current = useConnectionContext();
    hubConnection.current!.addAfterConnectionHandler(() => {
      
      hubConnection.current!.joinRoom(RoomIdGenerator.generateCampaignRoom(campaign.id!));

      hubConnection.current!.addEventListener(CampaignNewDonation.name, (event: IHubEvent<unknown>) => {
        console.log("new Donations",event);
        const beforeTotalAmount = campaign.current_donation_value;
        campaign.current_donation_value = (event.data as Campaign).current_donation_value;
        test.current = "data" + campaign.current_donation_value!.toString();
        setCurrentAmount((event.data as Campaign).current_donation_value)
        setActions([new ActionResultNotificationSuccess(`Someone donated ${campaign.current_donation_value!-beforeTotalAmount!}€`,5000)]);
        setTimeout(()=> {setActions([])}, 5050);
      });            
    });

    firstRender.current = false;
  }

  return (
        <div key={test.current}>
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
        
          <div className={styles.buttoncontainer}>
          <button
            className={styles.donateNowButton}
            onClick={() => setIsDonationModalOpen(true)} // Open modal on click
            >
            Donate Now
          </button>
          </div>
          <div>
            {
              isDonationModalOpen &&
              <DonationModal
                isOpen={isDonationModalOpen} // Modal visibility
                onClose={() => setIsDonationModalOpen(false)} // Close handler
                campaignId={campaign.id!} donorId={donorId}      
              />
            }
        </div>

        <div><TopDonors
            podiumDonors={topDonors}
          /></div>

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
              <div className={styles.fileContainer}>
                <object data={`/documents/${file.id}_${file.original_name}`} type="application/pdf" width="100%" height="200">
                  <p>Your browser does not support PDFs. <a href={`/api/file/${file.id}`} >Download the PDF</a>.</p>
                </object>
                <div className={styles.fileContainerLink}>
                  <a href={`/api/file/${file.id}`} ><span>Download</span> {file.original_name}</a>
                </div>
              </div>
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
        { 
            actions.length > 0 &&
            (
                <ActionDisplay actions={actions} />
            )
          }
        </div>
  );
}

export default ViewCampaignForm;