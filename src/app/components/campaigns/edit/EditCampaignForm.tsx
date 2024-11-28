"use client";

import { Dispatch, SetStateAction, useRef, useState } from "react";
import styles from "./EditCampaignForm.module.css";
import DropdownInput from "../../search/selectWithInput/selectWithInput";
import { BadgeTypes } from "@/models/types/BadgeTypes";
import { FileTypes } from "@/models/types/FileTypes";
import { IActionResultNotification } from "../../actionsNotifications/IActionResultNotification";
import { ActionDisplay } from "../../actionsNotifications/actionDisplay/ActionDisplay";
import { File as ModelFIle} from "@/models/File";
import { Campaign } from "@/models/Campaign";
import { Badge } from "@/models/Badge";
import { CampaignBadge } from "@/models/CampaignBadge";


interface AddedFile{ 
  field:string 
  type:FileTypes
  ,file:File 
}

const EditCampaignForm :React.FC<{campaign:Campaign}> = ({campaign}) =>
{
  const [ updatedFields, setUpdatedFields ] = useState<Map<string,any>>(new Map<string,any>());
  const [ removedFiles, setRemovedFiles ] = useState<ModelFIle[]>([]);
  const [ addedFiles, setAddedFiles ] = useState<AddedFile[]>([]);

  const [ badgePartner,setBadgePartner ] = useState<any | null>();
  const [ badgePartnerName,setBadgePartnerName ] = useState<string>();
  const [ badgePartnerDescription,setBadgePartnerDescription ] = useState<string>();
  const [ badgeFamilyImage,setBadgeFamilyImage ] = useState<ModelFIle | undefined>();
  const [ badgeFamilyName,setBadgeFamilyName ] = useState<string>();
  const [ badgeFamilyDescription,setBadgeFamilyDescription ] = useState<string>();
  const [ badgeHelper,setBadgeHelper ] = useState<ModelFIle>();
  const [ badgeHelperName,setBadgeHelperName ] = useState<string>();
  const [ badgeHelperDescription,setBadgeHelperDescription ] = useState<string>();

  const [images, setImages] = useState<ModelFIle[]>([]);
  const [videos, setVideos] = useState<ModelFIle[]>([]);
  const [files, setFiles] = useState<ModelFIle[]>([]);
  const [mainImage, setMainImage] = useState<ModelFIle[]>([]);

  const [submitted, setSubmitted] =  useState<boolean>(false);
  // const timeIncrement = 1000;

  for (const file of (campaign.files.value as ModelFIle[] ) ) 
  {
     switch (file.file_type) 
     {
        case FileTypes.Document:
          files.push(file);
          break;
        case FileTypes.Image:
          images.push(file);
          break;
        case FileTypes.MainImage:
          mainImage.push(file);
          break;
        case FileTypes.Video:
          videos.push(file);
          break;
     }
  }  

  const campaignBadge = (campaign.badges.value as CampaignBadge[]).find( 
    (campaignBadge) => 
    { 
      (campaignBadge.badge.value as Badge).type === BadgeTypes.CampaignFamily 
    }  
  ) 
  setBadgeFamilyImage( (campaignBadge?.badge.value! as Badge).image.value as ModelFIle );

  // const campaignBadge = (campaign.badges.value as CampaignBadge[]).find( 
  //   (campaignBadge) => 
  //   { 
  //     (campaignBadge.badge.value as Badge).type === BadgeTypes.CampaignFamily 
  //   }  
  // ) 
  // setBadgeFamily( (campaignBadge?.badge.value! as Badge).image.value as ModelFIle );

  // function handleBadgeImageInput( event: React.ChangeEvent<HTMLInputElement> , set:Dispatch<SetStateAction<File | undefined>> )
  // {
  //   const files = event.target.files;
  //   if (files) {
  //     const newImages = Array.from(files);
  //     set(newImages[0]);
  //   }
  // }

  

  // const handleMainImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   if (files) {
  //     const newImages = Array.from(files);
  //     setMainImage(newImages[0]);
  //   }
  // };

  // //Adds new file to the image list
  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   if (files) {
  //     const newImages = Array.from(files);
  //     setImages((prevImages) => [...prevImages, ...newImages]);

  //   }
  // };
  
  // //removes the selected image from the image list
  // const removeImage = (index: number) => {
  //   setImages((prevImages) => {
  //     const updatedImages = prevImages.filter((_, i) => i !== index);
  //     return updatedImages;
  //   });
  // };

  //Adds new file to the video list
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newVideos = Array.from(files);
      //setVideos((prevVideos) => [...prevVideos, ...newVideos]);
    }
  };

  //removes the selected video from the video list
  const removeVideo = (index: number) => {
    //setVideos((prevVideos) => prevVideos.filter((_, i) => i !== index));
  };

  //Adds new file to the file list
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      //setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  //removes the selected file from the file list
  const removeFile = (index: number) => {
    //setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));

  };

  //render for file previews 
  const renderFilePreview = (file: File) => 
  {
    const fileType = file.type;

    if (fileType.startsWith("image/")) 
      return <img src={URL.createObjectURL(file)} alt={file.name} className={styles.previewImage} />;

    else if (fileType.startsWith("video/")) 
      return <video controls className={styles.previewVideo}><source src={URL.createObjectURL(file)} type={file.type} /></video>;

    else if (fileType === "application/pdf") 
      return (
        <object data={URL.createObjectURL(file)} type="application/pdf" width="100%" height="200">
          <p>Your browser does not support PDFs. <a href={URL.createObjectURL(file)}>Download the PDF</a>.</p>
        </object>
      );
    else if (fileType === "text/plain") 
    {
      const [content, setContent] = useState<string | null>(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        setContent(e.target?.result as string);
      };
      reader.readAsText(file);

      return <pre className={styles.previewText}>{content}</pre>;

    } else 
      return <p>{file.name}</p>; // For unsupported file types
  };

  function addBadge(campaignId:number,type:BadgeTypes,image:File,description:string,name:string) : Promise<Response>
  {   
    const data = new FormData();
    data.append("name",name);
    data.append("description",description);
    data.append("type",type.toString());
    data.append("unit","n/a");
    data.append("value","0");
    data.append("campaignId",campaignId.toString());
    data.append("imageFile",image);

    return fetch("/api/badge",{method:"PUT",body:data});
  }

  
  function addImage(type:FileTypes,managerId:number,campaignId:number,image:File) : Promise<Response>
  { 
    const data = new FormData();
    data.append("type",type.toString());
    data.append("user_id",managerId.toString());
    data.append("campaign_id",campaignId.toString());
    data.append("imageFile",image);

    return fetch("/api/file",{method:"PUT",body:data});
  }

  function addImageArray(array:File[],type:FileTypes,managerId:number,campaignId:number) : Promise<Response>[]
  {
    const promises = [];
    for (const element of array) {
      promises.push( addImage(type,managerId,campaignId,element) )
    }

    return promises;
  }

 
  function continueToMy_Campaigns()
  {
    window.location.href = window.location.href.replace("create","my_campaigns");
  }

  const mainForm = useRef<HTMLFormElement>(null);
  const [actions,setActions] = useState<IActionResultNotification[]>([]);
  const [category,setCategory] = useState<string>("");

  const handleSubmit = async (e:any) => 
  {
    
  };


  return (
    <div className={styles.CampaignCreateContainer}>
      <form name="mainForm" className={styles.FormContainer} ref={mainForm}>
        <div className={styles.TextForm}>
          <div className={styles.FormTitle}><b>Title</b></div>
          <input 
            name="title" 
            id="title" 
            type="text" 
            className={styles.inputField} placeholder="Campaign Title"
          />
        </div>
        <div className={styles.TextForm}>
          <div className={styles.FormTitle}><b>Description</b></div>
            <textarea 
              name="description" 
              id="description" 
              className={styles.inputField} 
              rows={4} 
              placeholder="Campaign description"
            ></textarea>
        </div>
        <div className={styles.optionsContainer}>
          <div style={{flexGrow:1 , minWidth:"32.5%"}}>
            <div className={styles.FormTitle}><b>Campaign Category</b></div>
            <DropdownInput 
              width={"100%"} 
              heigh={40} 
              color="rgba(26, 0, 37, 1)" 
              options={["Health","School","StartUp","Debt"]} 
              onChange={(v)=>{setCategory(v);}}
            ></DropdownInput>
          </div>
          <div style={{flexGrow:1}}>
            <div className={styles.FormTitle}><b>Goal Amount</b></div>
            <input 
              name="objective_value" 
              id="objective_value" 
              type="number" 
              className={styles.inputField2} placeholder="Goal Amount €"
            />
          </div>
          <div style={{flexGrow:1}}>
            <div className={styles.FormTitle}><b>End Date</b></div>
            <input 
              name="end_date" 
              id="end_date" 
              type="date" 
              className={styles.inputField2}
            />
          </div>
        </div>
          
        <div className={styles.TextForm}>
          <div className={styles.TextFormBank}> <b>Bank Account Details</b> </div>
          <div className={ `${"a"} ${styles.bankFormContainer}`}>
            <input 
              name="bank_name" 
              id="bank_name" 
              type="text" 
              className={styles.inputFieldBank} 
              placeholder="Bank Name"
            />
            <input 
              name="iban" 
              id="iban" 
              type="text" 
              className={styles.inputFieldBank} 
              placeholder="IBAN"
            />
            <input 
              name="account_holder" 
              id="account_holder" 
              type="text" 
              className={styles.inputFieldBank} 
              placeholder="Account Owner"
            />
          </div>
        </div>
        <div className={styles.TextForm}>
          <div className={styles.TextFormBank}> <b>Contact Information</b> </div>
          <div className={ `${"a"} ${styles.bankFormContainer}`}>
            <input 
              name="contact_email" 
              id="bank_name" 
              type="email" 
              className={styles.inputFieldBank} 
              placeholder="Contact email"
            />
            <input 
              name="contact_phone_number" 
              id="iban" 
              type="number" 
              className={styles.inputFieldBank} 
              placeholder="Contact Phone Number"
            />
          </div>
        </div>
      </form>
      <div className={styles.FormContainer}>
        <div className={styles.TextForm}><b>Badges</b></div>
        <div className={styles.badgesContainerContainer}>
          <div className={styles.badgesContainer}>
            <div className={styles.badgeContainer}>
              <div className={styles.TextForm}>Family</div>
              <div className={styles.imagePlaceHolder}>
              { 
                badgeFamilyImage &&
                <img
                  src={`/documents/${badgeFamilyImage.id}_${badgeFamilyImage.original_name}`}
                  alt={`Preview`}
                  className={styles.previewBadgeImage}
                />
              }
              </div>
              <input className={styles.badgeInput}
                type="file"
                id="badge_image"
                name="campaign_image"
                accept="image/png, image/gif, image/jpeg"
                //onChange={(e)=>{handleBadgeImageInput(e,setBadgeFamily)}}
              />
              <input 
                type="text" 
                className={styles.inputFieldBank} 
                placeholder="Name"
               // onChange={(e)=>setBadgeFamilyName( e.target.value! )}
              />
              <input 
                type="text" 
                className={styles.inputFieldBank} 
                placeholder="Description"
               // onChange={(e)=>setBadgeFamilyDescription( e.target.value! )}
              />
            </div>
            <div className={styles.badgeContainer}>
              <div className={styles.TextForm}>Helper</div>
              <div className={styles.imagePlaceHolder}>
                {/* { 
                  badgeHelper  &&
                  <img
                    src={URL.createObjectURL(badgeHelper)} // Generate the object URL when rendering
                    alt={`Preview`}
                    className={styles.previewBadgeImage}
                  />
                } */}
              </div>
              <input className={styles.badgeInput}
                type="file"
                id="campaign_image"
                name="campaign_image"
                accept="image/png, image/gif, image/jpeg"
              //  onChange={(e)=>{handleBadgeImageInput(e,setBadgeHelper)}}
              />
              <input 
                type="text" 
                className={styles.inputFieldBank} 
                placeholder="Name"
                onChange={(e)=>setBadgeHelperName( e.target.value! )}
              />
              <input 
                type="text" 
                className={styles.inputFieldBank} 
                placeholder="Description"
                onChange={(e)=>setBadgeHelperDescription( e.target.value! )}
              />
            </div>
            <div className={styles.badgeContainer}>
            <div className={styles.TextForm}>Partner</div>
              <div className={styles.imagePlaceHolder}>
                {/* { 
                  badgePartner  &&
                  <img
                    src={URL.createObjectURL(badgePartner)} // Generate the object URL when rendering
                    alt={`Preview`}
                    className={styles.previewBadgeImage}
                  />
                } */}
              </div>
              <input className={styles.badgeInput}
                type="file"
                id="campaign_image"
                name="campaign_image"
                accept="image/png, image/gif, image/jpeg"
               // onChange={(e)=>{handleBadgeImageInput(e,setBadgePartner)}}
              />
              <input 
                type="text" 
                className={styles.inputFieldBank} 
                placeholder="Name"
               // onChange={(e)=>setBadgePartnerName( e.target.value! )}
              />
              <input 
                type="text" 
                className={styles.inputFieldBank} 
                placeholder="Description"
              //  onChange={(e)=>setBadgePartnerDescription( e.target.value! )}
              />
            </div>
          </div>
        </div>
        {/* Campaign Images Upload */}
        <div className={styles.fileForm}>
          <div className={styles.fileFormTitle}>
              <b>Campaign Front Image</b>
          </div>
          <input
              
              type="file"
              id="campaign_image"
              name="campaign_image"
              accept="image/png, image/gif, image/jpeg"
              //onChange={handleMainImageUpload}
              />
          </div>
        <div className={styles.filePreviewContainer}>
          {
           // mainImage && 
            // <img 
            //   src={URL.createObjectURL(mainImage)} // Generate the object URL when rendering
            //   alt={`Preview`}
            //   className={styles.mainImage}
            // />
          }
        </div>
        <div className={styles.fileForm}>
          <div className={styles.fileFormTitle}>
              <b>Campaign Images</b>
          </div>
          <input
              
              type="file"
              id="campaign_image"
              name="campaign_image"
              accept="image/png, image/gif, image/jpeg"
              multiple
            //  onChange={handleImageUpload}
              />
          </div>
        <div className={styles.filePreviewContainer}>
        {images.map((image, index) => (
          <div key={index} className={styles.imagePreview}>
            {/* <img
                src={URL.createObjectURL(image)} // Generate the object URL when rendering
                alt={`Preview ${index + 1}`}
                className={styles.previewImage}
                />
            <button
                onClick={() => removeImage(index)}
                className={styles.removeButton}
                >
                X
            </button> */}
            </div>
        ))}
        </div>
        {/* Campaign Videos Upload */}
        <div className={styles.fileForm}>
        <div className={styles.fileFormTitle}><b>Campaign Videos</b></div>
        <input
            type="file"
            name="campaign_video"
            id="campaign_video"
            accept="video/mp4"
            multiple
            onChange={handleVideoUpload}
            />
        </div>
        <div className={styles.filePreviewContainer}>
        {videos.map((video, index) => (
          <div key={index} className={styles.videoPreview}>
            {/* <video
                controls
                className={styles.previewVideo}
                >
                <source src={URL.createObjectURL(video)} type={video.type} />
                Your browser does not support the video tag.
            </video>
            <button
                onClick={() => removeVideo(index)}
                className={styles.removeButton}
                >
                X
            </button> */}
            </div>
        ))}
        </div>
        {/* Campaign File Upload */}
        <div className={styles.fileForm}>
        <div className={styles.fileFormTitle}><b>Campaign Files</b></div>
        <input
            type="file"
            name="campaign_file"
            id="campaign_file"
            accept=".pdf, .docx, .xlsx, .txt"
            multiple
            onChange={handleFileUpload}
            />
        </div>
        <div className={styles.filePreviewContainer}>
        {files.map((file, index) => (
          <div key={index} className={styles.filePreview}>
            {/* {renderFilePreview(file)}
            <button
                onClick={() => removeFile(index)}
                className={styles.removeButton}
                >
                X
            </button> */}
            </div>
        ))}
        </div>
        {
          !submitted &&
          <div className={styles.ButtonFormContainer}>
            <div className={styles.line}>
              <div className={styles.ButtonForm} >
                <button className={styles.submitButton} onClick={handleSubmit}>
                    Cancel
                </button>
              </div>
              <div className={styles.ButtonForm}>
                <button className={styles.submitButtonUpdate} onClick={handleSubmit}>
                    Update
                </button>
              </div>
            </div>
          </div>
        }
        {
          submitted &&
          <div className={styles.ButtonForm}>
            <button className={styles.submitButton} onClick={() => continueToMy_Campaigns() }>
                Continue
            </button>
          </div>
        }
      </div>
      <div>
      { 
        actions.length > 0 &&
        (
            <ActionDisplay actions={actions} />
        )
      }
      </div>
    </div>
  );
}

export default EditCampaignForm;