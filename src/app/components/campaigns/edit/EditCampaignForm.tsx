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
import { BankAccount } from "@/models/BankAccount";
import { array } from "yup";
import { StringUtils } from "@/core/utils/StringUtils";
import { ActionResultNotificationError } from "../../actionsNotifications/ActionResultNotificationError";
import { ActionResultNotificationSuccess } from "../../actionsNotifications/ActionResultNotificationSuccess";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { CampaignStatus } from "@/models/types/CampaignStatus";

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

const EditCampaignForm :React.FC<{userType:number,userId:number,campaign:Campaign}> = ({userType,userId,campaign}) =>
{
  const [ firstRender, setFirstRender ] = useState<boolean>(true);
  const [ render,setRender] = useState<number>(0);
  const [submitted, setSubmitted] =  useState<boolean>(false);

  const [ updatedFields, setUpdatedFields ] = useState<Map<string,{type:FieldEntitiesTypes,value:string,badgeType:BadgeTypes|null}>>(new Map<string,any>());
  const [ fieldsValue, setFieldsValue ] = useState<Map<string,string>>(new Map<string,string>());
  const [ removedFiles, setRemovedFiles ] = useState<ModelFIle[]>([]);

  const [ badgePartner ,setBadgePartner] = useState<Badge | null>( getBadgeWithType(campaign,BadgeTypes.CampaignPartner) );
  const [ badgeFamily, setBadgeFamily ] = useState<Badge | null>( getBadgeWithType(campaign,BadgeTypes.CampaignFamily) );
  const [ badgeHelper, setBadgeHelper ] = useState<Badge | null>( getBadgeWithType(campaign,BadgeTypes.CampaignHelper) );

  const [ badgePartnerFile ,setBadgePartnerFile] = useState<File | null>( null );
  const [ badgeFamilyFile, setBadgeFamilyFile ] = useState<File | null>( null);
  const [ badgeHelperFile, setBadgeHelperFile ] = useState<File | null>( null );

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

    for (const key of (new BankAccount).getKeys()) 
    { 
        fieldsValue.set(key,(campaign.bank_account!.value as BankAccount)[key]! as string);
    }

    for (const campaignBadge of campaign.badges.value as CampaignBadge[]) 
    {  
        const type = (campaignBadge.badge.value as Badge).type
        fieldsValue.set(`${type}_name`,((campaignBadge.badge.value as Badge).name!));
        fieldsValue.set(`${type}_description`,((campaignBadge.badge.value as Badge).description!));
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

    setFirstRender(false);
  }

  function isChanged(field:string):string
  {
    return updatedFields.get(field) !== undefined ? styles.changed : "";
  }

  function updateField(field:string,type:FieldEntitiesTypes,newValue:string,badgeType:BadgeTypes|null =null)
  {
    fieldsValue.get(field);
    let object: { [key:string]:any} ;
    let _field = field;
    switch(type)
    {
      case FieldEntitiesTypes.BANK:
        object = campaign.bank_account.value!;
        break;
      case FieldEntitiesTypes.BADGE:
        const splittedField = field.split("_");
        const type = Number(splittedField[0]);
        _field = splittedField[1];
        object = getBadgeWithType(campaign,type)!;
        break;
      case FieldEntitiesTypes.CAMPAIGN:
      default:
        object = campaign;
    }
    if(newValue == object[_field] || ( field === "end_date" && formatDateToYYYYMMDD(object[_field]) == newValue ) ) 
      updatedFields.delete(field);
    else
      updatedFields.set(field,{type,value:newValue,badgeType});
    
    fieldsValue.set(field,newValue);
    setRender(render+1);
  }

  function removeFile(file:ModelFIle,array:ModelFIle[],set:Dispatch<SetStateAction<ModelFIle[]>>)
  {
    removedFiles.push(file);
    set( array.filter((item) => item.id !== file.id) );
  }
  
  function addSingleFile(file:File,map:Map<string,File>) 
  {
      map.set(file.name,file);
      setRender(render-1);
  }

  function addFile(files:FileList,map:Map<string,File>) 
  {
    for (const file of files) 
    {
      map.set(file.name,file);
      setRender(render-1);
    }
  }

  function removeAddedFile(file:File,map:Map<string,File>)
  {
    map.delete(file.name);
    setRender(render+1);
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
    window.location.href = "/campaigns/my_campaigns"
  }

  const mainForm = useRef<HTMLFormElement>(null);
  const [actions,setActions] = useState<IActionResultNotification[]>([]);
  const [category,setCategory] = useState<string>("");

  function constructForms(array:IActionResultNotification[], time:{time:number}, delay:number = 1000 ): FormsData
  {

    let campaignFormData = new FormData();
    campaignFormData.set("id",campaign.id!.toString());

    let bankForm = new FormData();
    console.log((campaign.bank_account.value as BankAccount).id);
    bankForm.set("id",(campaign.bank_account.value as BankAccount).id!.toString());

    let badgeFamilyFormData = new FormData();
    badgeFamilyFormData.set("id", getBadgeWithType(campaign,BadgeTypes.CampaignFamily)!.id!.toString());

    let badgeHelperFormData = new FormData();
    badgeHelperFormData.set("id", getBadgeWithType(campaign,BadgeTypes.CampaignHelper)!.id!.toString());

    let badgePartnerFormData = new FormData();
    badgePartnerFormData.set("id", getBadgeWithType(campaign,BadgeTypes.CampaignPartner)!.id!.toString());
    
    for (const [ key, valueObj ]  of updatedFields.entries()) 
    {
      if(StringUtils.stringIsNullOrEmpty(valueObj.value))
      {
        array.push( new ActionResultNotificationError(key,["Can not be empty"],time.time+=delay))
        continue;
      }

      switch (valueObj.type) 
      {
        case FieldEntitiesTypes.CAMPAIGN:
          campaignFormData.set(key,valueObj.value);
          break;
        case FieldEntitiesTypes.BANK:
          bankForm.set(key,valueObj.value);
          break;
        case FieldEntitiesTypes.BADGE:
          let splitted = key.split("_");
          let badgeKey = splitted[1];
          let type = Number(splitted[0]);

          switch (type) 
          {
            case BadgeTypes.CampaignFamily:
              badgeFamilyFormData.set(badgeKey,valueObj.value);
              break;
            case BadgeTypes.CampaignPartner:
              badgePartnerFormData.set(badgeKey,valueObj.value);
              break;
            case BadgeTypes.CampaignHelper:
              badgeHelperFormData.set(badgeKey,valueObj.value);
              break;
          }
          break;
      }
      
    }
    return { campaignFormData, bankForm, badgeFamilyFormData, badgeHelperFormData, badgePartnerFormData } 
  }

  function validateFiles(data:FormsData,array:IActionResultNotification[],time:number,delay:number = 1000)
  {
    if( !mainImage && !mainImageAdded )
      array.push( new ActionResultNotificationError("Main Image",["Can not be empty"],time+=delay) )

    if( !badgeFamily && !badgeFamilyFile )
      array.push( new ActionResultNotificationError("Family badge Image",["Can not be empty"],time+=delay) )
    else if(badgeFamilyFile)
      data.badgeFamilyFormData.set("imageFile",badgeFamilyFile);

    if( !badgeHelper && !badgeHelperFile  )
      array.push( new ActionResultNotificationError("Helper badge image",["Can not be empty"],time+=delay) )
    else if(badgeHelperFile)
      data.badgeHelperFormData.set("imageFile",badgeHelperFile);

    if( !badgePartner && !badgePartnerFile )
      array.push( new ActionResultNotificationError("Partner badge image",["Can not be empty"],time+=delay) )
    else if(badgePartnerFile)
      data.badgePartnerFormData.set("imageFile",badgePartnerFile);
  }

  function sendUpdate(responses:Promise<Response>[],formData:FormData | null, url:string,method:string = "PATCH")
  {
    if( formData && formData.entries().find(([key,v])=> key!="id") != undefined)
    {
      responses.push( fetch(url,{method,body:formData}) );
    }
    else if (!formData)
    {
      responses.push( fetch(url,{method}) );
    }
  }

  function createPutFileFormData(campaign_id:number,user_id:number,type:FileTypes,file:File) : FormData
  {
    const formData = new FormData();

    formData.append("campaign_id", campaign_id.toString());
    formData.append("user_id", user_id.toString());
    formData.append("type", type.toString());
    formData.append("imageFile", file);

    return formData;
  }

  function sendUpdates(formsData:FormsData) : Promise<Response>[]
  {
    const results:Promise<Response>[] = []
    sendUpdate(results,formsData.campaignFormData,`/api/campaign/${campaign.id}`);
    sendUpdate(results,formsData.bankForm,`/api/bank_account/${campaign.bank_account_id}`);
    sendUpdate(results,formsData.badgeFamilyFormData,`/api/badge/${getBadgeWithType(campaign,BadgeTypes.CampaignPartner)?.id}`);
    sendUpdate(results,formsData.badgeHelperFormData,`/api/badge/${getBadgeWithType(campaign,BadgeTypes.CampaignHelper)?.id}`);
    sendUpdate(results,formsData.badgePartnerFormData,`/api/badge/${getBadgeWithType(campaign,BadgeTypes.CampaignPartner)?.id}`);

    for (const file of removedFiles) 
    {
       const data = new FormData()
      //  data.set("id",file.id!.toString())
       data.set("user_id",userId.toString())
       sendUpdate(results,data,`/api/file/${file.id}`,"DELETE");
    }
    

    for (const [field,file] of filesAdded) 
      sendUpdate(results,createPutFileFormData(campaign.id!,userId,FileTypes.Document,file),"/api/file","PUT");

    for (const [field,file] of videosAdded) 
      sendUpdate(results,createPutFileFormData(campaign.id!,userId,FileTypes.Video,file),"/api/file","PUT");

    for (const [field,file] of imagesAdded) 
      sendUpdate(results,createPutFileFormData(campaign.id!,userId,FileTypes.Image,file),"/api/file","PUT");

    if(mainImageAdded)
      sendUpdate(results,createPutFileFormData(campaign.id!,userId,FileTypes.MainImage,mainImageAdded),"/api/file","PUT");

    return results;
  }

  const handleSubmit = async (e:any) => 
  {
    setActions(new Array());
    const actionsResult: IActionResultNotification[] = [];
    let time = 1000;
    let timeIncrement = 2000;
    const formsData = constructForms(actionsResult,{time});
    validateFiles(formsData,actionsResult,time)

    if(actionsResult.length > 0)
    {
      setTimeout( () => setActions(actionsResult) , 1 );
      return;
    }

    const allResponses = await Promise.all( sendUpdates(formsData) );

    for (const response of allResponses) 
    {
      switch(response.status)
      {
        case 200:
          actionsResult.push( new ActionResultNotificationSuccess(response.statusText,time+=timeIncrement ) );
          break;
        case 422:
          const resultErrors = await response.json();
          for (const error of resultErrors.errors) 
          {
            actionsResult.push( new ActionResultNotificationError(error.field,error.errors,time+=timeIncrement) );
          }
          break;
        default:
          actionsResult.push( new ActionResultNotificationError( response.status.toString() , [response.statusText],time+=timeIncrement ) );
          break;
      }
    }

    setActions(actionsResult);
    if( actionsResult.find( (action)=> action instanceof ActionResultNotificationSuccess ))
      setSubmitted(true);
  };

  const isAdmin = userType === UserRoleTypes.Admin;

  function sendUpdateStatus(campaignId:number, status:string)
  {
    const formdata =new FormData();
    formdata.set('status', status);

    fetch(`/api/campaign/${campaignId}`, {
      method: "PATCH",
      body: formdata,
    })
      .then(async (response) => {
        if (response.ok) {
          // If the request was successful, redirect the user
          window.location.href = "/adminpage";
        } else {
          // If the response is not ok, handle the error
          const errorData = await response.json();
          console.error("Error updating campaign:", errorData.message || "Unknown error");
          alert(`Failed to update campaign: ${errorData.message || "Please try again later."}`);
        }
      })
      .catch((error) => {
        // Handle network or unexpected errors
        console.error("Network or server error:", error);
        alert("A network error occurred. Please check your connection and try again.");
      });
  }

  return (
    <div className={styles.CampaignCreateContainer}>
      <form name="mainForm" className={styles.FormContainer} ref={mainForm}>
        <div className={styles.TextForm}>
          <div className={styles.FormTitle}><b>Title</b></div>
          <input 
            name="title" 
            id="title" 
            type="text" 
            value={fieldsValue.get("title")}
            className={`${styles.inputField} ${isChanged("title")}`} 
            placeholder="Campaign Title"
            onChange={(e)=>{!isAdmin && updateField("title",FieldEntitiesTypes.CAMPAIGN,e.target.value);}}
          />
        </div>
        <div className={styles.TextForm}>
          <div className={styles.FormTitle}><b>Description</b></div>
            <textarea 
              name="description" 
              id="description" 
              className={`${styles.inputField} ${isChanged("description")}`}  
              rows={4} 
              value={fieldsValue.get("description")}
              onChange={(e)=>{!isAdmin && updateField("description",FieldEntitiesTypes.CAMPAIGN,e.target.value);}}
              placeholder="Campaign description"
            ></textarea>
        </div>
        <div className={styles.optionsContainer}>
          <div style={{flexGrow:1 , minWidth:"32.5%"}}>
            <div className={styles.FormTitle}><b>Campaign Category</b></div>
            <div className={isAdmin ? styles.disabledDropdown : ""}>
            <DropdownInput 
              width={"100%"} 
              heigh={40} 
              color="rgba(26, 0, 37, 1)"
              value={fieldsValue.get("category") as string}
              customContainerStyle={isChanged("category")}
              options={["Health","School","StartUp","Debt"]} 
              onChange={(value)=>{!isAdmin && updateField("category",FieldEntitiesTypes.CAMPAIGN,value);}}
            ></DropdownInput>
            </div>
          </div>
          <div style={{flexGrow:1}}>
            <div className={styles.FormTitle}><b>Goal Amount</b></div>
            <input 
              name="objective_value" 
              id="objective_value" 
              type="number" 
              value={fieldsValue.get("objective_value")}
              onChange={(e)=>{!isAdmin && updateField("objective_value",FieldEntitiesTypes.CAMPAIGN,e.target.value);}}
              className={`${styles.inputField2} ${isChanged("objective_value")}`} 
              placeholder="Goal Amount €"
            />
          </div>
          <div style={{flexGrow:1}}>
            <div className={styles.FormTitle}><b>End Date</b></div>
            <input 
              name="end_date" 
              id="end_date" 
              type="date" 
              value={fieldsValue.get("end_date")}
              onChange={(e)=>{!isAdmin && updateField("end_date",FieldEntitiesTypes.CAMPAIGN,e.target.value);}}
              className={`${styles.inputField2} ${isChanged("end_date")}`} 
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
              value={fieldsValue.get("bank_name")}
              onChange={(e)=>{!isAdmin && updateField("bank_name",FieldEntitiesTypes.BANK,e.target.value);}}
              className={`${styles.inputFieldBank} ${isChanged("bank_name")}`} 
              placeholder="Bank Name"
            />
            <input 
              name="iban" 
              id="iban" 
              type="text" 
              value={fieldsValue.get("iban")}
              onChange={(e)=>{!isAdmin && updateField("iban",FieldEntitiesTypes.BANK,e.target.value);}}
              className={`${styles.inputFieldBank} ${isChanged("iban")}`} 
              placeholder="IBAN"
            />
            <input 
              name="account_holder" 
              id="account_holder" 
              type="text" 
              value={fieldsValue.get("account_holder")}
              onChange={(e)=>{!isAdmin && updateField("account_holder",FieldEntitiesTypes.BANK,e.target.value);}}
              className={`${styles.inputFieldBank} ${isChanged("account_holder")}`} 
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
              className={`${styles.inputFieldBank} ${isChanged("contact_email")}`} 
              value={fieldsValue.get("contact_email")}
              onChange={(e)=>{!isAdmin && updateField("contact_email",FieldEntitiesTypes.CAMPAIGN,e.target.value);}}
              placeholder="Contact email"
            />
            <input 
              name="contact_phone_number" 
              id="iban" 
              type="number" 
              className={`${styles.inputFieldBank} ${isChanged("contact_phone_number")}`} 
              value={fieldsValue.get("contact_phone_number")}
              onChange={(e)=>{!isAdmin && updateField("contact_phone_number",FieldEntitiesTypes.CAMPAIGN,e.target.value);}}
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
                badgeFamily && badgeFamily.image.value && 
                  <img
                    src={`/documents/${(badgeFamily.image.value as ModelFIle).id}_${(badgeFamily.image.value as ModelFIle).original_name}`}
                    alt={`Preview`}
                    className={styles.previewBadgeImage}
                  />
              }
              { 
                badgeFamilyFile && !(badgeFamily?.image.value) && 
                  <img src={URL.createObjectURL(badgeFamilyFile)} alt={badgeFamilyFile.name} className={styles.previewImage} />
              }
              </div>
              { 
                badgeFamily && badgeFamily.image.value &&
                !isAdmin && <input className={styles.badgeInput}
                  type="file"
                  id="badge_image"
                  name="campaign_image"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={(e)=>{
                      removedFiles.push(badgeFamily.image.value as ModelFIle); 
                      if(e.target.files) setBadgeFamilyFile(e.target.files[0]); 
                      setBadgeFamily(null);
                      console.log("changed");
                    } 
                  }
                />
              }
              { 
                !badgeFamily && 
                !isAdmin && <input className={styles.badgeInput}
                  type="file"
                  id="badge_image"
                  name="campaign_image"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={(e)=>{ if(e.target.files) setBadgeFamilyFile(e.target.files[0]);}}
                />
              }
              
              <input 
                type="text" 
                placeholder="Name"
                className={`${styles.inputFieldBank} ${isChanged(`${BadgeTypes.CampaignFamily}_name`)}`} 
                value={ fieldsValue.get(`${BadgeTypes.CampaignFamily}_name`) }
                onChange={(e)=>{!isAdmin && updateField(`${BadgeTypes.CampaignFamily}_name`,FieldEntitiesTypes.BADGE,e.target.value,BadgeTypes.CampaignFamily);}}
              />
              <input 
                type="text" 
                className={`${styles.inputFieldBank} ${isChanged(`${BadgeTypes.CampaignFamily}_description`)}`} 
                value={ fieldsValue.get(`${BadgeTypes.CampaignFamily}_description`) }
                onChange={(e)=>{!isAdmin && updateField(`${BadgeTypes.CampaignFamily}_description`,FieldEntitiesTypes.BADGE,e.target.value,BadgeTypes.CampaignFamily);}}
                placeholder="Description"
              />
            </div>
            <div className={styles.badgeContainer}>
              <div className={styles.TextForm}>Helper</div>
              <div className={styles.imagePlaceHolder}>
              { 
                badgeHelper && badgeHelper.image.value && 
                  <img
                    src={`/documents/${(badgeHelper.image.value as ModelFIle).id}_${(badgeHelper.image.value as ModelFIle).original_name}`}
                    alt={`Preview`}
                    className={styles.previewBadgeImage}
                  />
              }
              { 
                badgeHelperFile && !(badgeHelper?.image.value) && 
                  <img src={URL.createObjectURL(badgeHelperFile)} alt={badgeHelperFile.name} className={styles.previewImage} />
              }
              </div>
              { 
                badgeHelper && badgeHelper.image.value &&
                !isAdmin && <input className={styles.badgeInput}
                  type="file"
                  id="badge_image"
                  name="campaign_image"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={(e)=>{ 
                    !isAdmin && removedFiles.push(badgeHelper.image.value as ModelFIle); 
                    if(e.target.files) {
                      setBadgeHelperFile(e.target.files[0]); 
                      setBadgeHelper(null);
                    }
                  }}
                />
              }
              { 
                !badgeHelper && 
                !isAdmin && <input className={styles.badgeInput}
                  type="file"
                  id="badge_image"
                  name="campaign_image"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={(e)=>{ if(e.target.files) setBadgeHelperFile(e.target.files[0]);}}
                />
              }
              <input 
                type="text" 
                placeholder="Name"
                className={`${styles.inputFieldBank} ${isChanged(`${BadgeTypes.CampaignHelper}_name`)}`} 
                value={ fieldsValue.get(`${BadgeTypes.CampaignHelper}_name`) }
                onChange={(e)=>{!isAdmin && updateField(`${BadgeTypes.CampaignHelper}_name`,FieldEntitiesTypes.BADGE,e.target.value,BadgeTypes.CampaignHelper);}}
              />
              <input 
                type="text" 
                className={`${styles.inputFieldBank} ${isChanged(`${BadgeTypes.CampaignHelper}_description`)}`} 
                value={ fieldsValue.get(`${BadgeTypes.CampaignHelper}_description`) }
                onChange={(e)=>{!isAdmin && updateField(`${BadgeTypes.CampaignHelper}_description`,FieldEntitiesTypes.BADGE,e.target.value,BadgeTypes.CampaignHelper);}}
              />
            </div>
            <div className={styles.badgeContainer}>
            <div className={styles.TextForm}>Partner</div>
              <div className={styles.imagePlaceHolder}>
              { 
                badgePartner && badgePartner.image.value && 
                  <img
                    src={`/documents/${(badgePartner.image.value as ModelFIle).id}_${(badgePartner.image.value as ModelFIle).original_name}`}
                    alt={`Preview`}
                    className={styles.previewBadgeImage}
                  />
              }
              { 
                badgePartnerFile && !(badgePartner?.image.value) && 
                  <img src={URL.createObjectURL(badgePartnerFile)} alt={badgePartnerFile.name} className={styles.previewImage} />
              }
              </div>
              { 
                badgePartner && badgePartner.image.value &&
                !isAdmin && <input className={styles.badgeInput}
                  type="file"
                  id="badge_image"
                  name="campaign_image"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={(e)=>{ 
                    !isAdmin && removedFiles.push(badgePartner.image.value as ModelFIle); 
                    if(e.target.files) {
                      setBadgePartnerFile(e.target.files[0]); 
                      setBadgePartner(null);
                    }
                  }}
                />
              }
              { 
                !badgePartner && 
                !isAdmin && <input className={styles.badgeInput}
                  type="file"
                  id="badge_image"
                  name="campaign_image"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={(e)=>{ if(e.target.files) setBadgePartnerFile(e.target.files[0]);}}
                />
              }
              <input 
                type="text" 
                placeholder="Name"
                className={`${styles.inputFieldBank} ${isChanged(`${BadgeTypes.CampaignPartner}_name`)}`} 
                value={ fieldsValue.get(`${BadgeTypes.CampaignPartner}_name`) }
                onChange={(e)=>{!isAdmin && updateField(`${BadgeTypes.CampaignPartner}_name`,FieldEntitiesTypes.BADGE,e.target.value,BadgeTypes.CampaignPartner);}}
              />
              <input 
                type="text" 
                placeholder="Description"
                className={`${styles.inputFieldBank} ${isChanged(`${BadgeTypes.CampaignPartner}_description`)}`} 
                value={ fieldsValue.get(`${BadgeTypes.CampaignPartner}_description`) }
                onChange={(e)=>{!isAdmin && updateField(`${BadgeTypes.CampaignPartner}_description`,FieldEntitiesTypes.BADGE,e.target.value,BadgeTypes.CampaignPartner);}}
              />
            </div>
          </div>
        </div>
        {/* Campaign Images Upload */}
        <div className={styles.fileForm}>
          <div className={styles.fileFormTitle}>
              <b>Campaign Front Image</b>
          </div>
          {
            mainImage.length > 0 &&
            !isAdmin && <input
                
                type="file"
                id="campaign_image"
                name="campaign_image"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e)=>{ 
                    if(e.target.files)
                    {
                      !isAdmin && removeFile(mainImage[0],mainImage,setMainImage);
                      setMainImageAdded(e.target.files[0] ) 
                    }
                  }
                }
              />
          }
          {
            mainImage.length == 0 && 
            <input
                
                type="file"
                id="campaign_image"
                name="campaign_image"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e)=>{ 
                  if(e.target.files)
                    setMainImageAdded(e.target.files[0] ) 
                  }}
            />
          }
        </div>
        <div className={styles.filePreviewContainer}>
          {
           mainImage.length > 0  && 
            <img 
              src={`/documents/${mainImage[0].id}_${mainImage[0].original_name}`}
              alt={`Preview`}
              className={styles.mainImage}
            />
          }
          {
            mainImageAdded &&
            <img src={URL.createObjectURL(mainImageAdded)} alt={mainImageAdded.name} className={styles.previewImage} />
          }
        </div>
        <div className={styles.fileForm}>
          <div className={styles.fileFormTitle}>
              <b>Campaign Images</b>
          </div>
          {
          !isAdmin && <input
              type="file"
              id="campaign_image"
              name="campaign_image"
              accept="image/png, image/gif, image/jpeg"
              multiple
              onChange={(e)=> {addFile(e.target.files? e.target.files: new FileList(),imagesAdded)}}
              />
              }
          </div>
        <div className={styles.filePreviewContainer}>
        {images.map((image, index) => (
          <div key={index} className={styles.imagePreview}>
            <img
                src={`/documents/${image.id}_${image.original_name}`} // Generate the object URL when rendering
                alt={`Preview ${index + 1}`}
                className={styles.previewImage}
                />
            <button
                onClick={() => !isAdmin && removeFile(image,images,setImages)}
                className={styles.removeButton}
                >
                X
            </button>
          </div>
        ))}
         {
          Array.from(imagesAdded.entries()).map( ([name,file],index) => 
          (
            <div key={index} className={styles.imagePreview}>
            {
              <img src={URL.createObjectURL(file)} alt={file.name} className={styles.previewImage} />
            }
            <button
                onClick={() => !isAdmin && removeAddedFile(file,imagesAdded)}
                className={styles.removeButton}
                >
                X
            </button>
          </div>
          )
        )
        }
        </div>
        {/* Campaign Videos Upload */}
        <div className={styles.fileForm}>
        <div className={styles.fileFormTitle}><b>Campaign Videos</b></div>
        {!isAdmin && <input
            type="file"
            name="campaign_video"
            id="campaign_video"
            accept="video/mp4"
            multiple
            onChange={(e)=>!isAdmin && addFile(e.target.files? e.target.files: new FileList(),videosAdded)}
            />}
        </div>
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
            <button
                onClick={() => !isAdmin && removeFile(video,videos,setVideos)}
                className={styles.removeButton}
                >
                X
            </button>
            </div>
        ))}
        {
          Array.from(videosAdded.entries()).map( ([name,file],index) => 
          (
            <div key={index} className={styles.videoPreview}>
            {
              <video controls width="100%" height="200" className={styles.previewVideo}>
                <source src={URL.createObjectURL(file)} type={`${file.type}`} />
                <p>Your browser does not support videos. <a href={URL.createObjectURL(file)}>Download the video</a>.</p>
              </video>
            }
            <button
                onClick={() => !isAdmin && removeAddedFile(file,videosAdded)}
                className={styles.removeButton}
                >
                X
            </button>
          </div>
          )
        )
        }
        </div>
        {/* Campaign File Upload */}
        <div className={styles.fileForm}>
        <div className={styles.fileFormTitle}><b>Campaign Files</b></div>
        {!isAdmin && <input
            type="file"
            name="campaign_file"
            id="campaign_file"
            accept=".pdf, .docx, .xlsx, .txt"
            multiple
            onChange={(e)=>{addFile(e.target.files? e.target.files: new FileList() ,filesAdded)}}
            />}
        </div>
        <div className={styles.filePreviewContainer}>
        {files.map((file, index) => (
          <div key={index} className={styles.filePreview}>
            {
              <object data={`/documents/${file.id}_${file.original_name}`} type="application/pdf" width="100%" height="200">
                <p>Your browser does not support PDFs. <a href={`/documents/${file.id}_${file.original_name}`}>Download the PDF</a>.</p>
              </object>
            }
            <button
                onClick={() => !isAdmin && removeFile(file,files,setFiles)}
                className={styles.removeButton}
                >
                X
            </button>
          </div>
        ))}
        {
          Array.from(filesAdded.entries()).map( ([name,file],index) => 
          (
            <div key={index} className={styles.filePreview}>
            {
              <object data={URL.createObjectURL(file)} type="application/pdf" width="100%" height="200">
                <p>Your browser does not support PDFs. <a href={URL.createObjectURL(file)}>Download the PDF</a>.</p>
              </object>
            }
            <button
                onClick={() => removeAddedFile(file,filesAdded)}
                className={styles.removeButton}
                >
                X
            </button>
          </div>
          )
        )
        }
        </div>
        {
          !submitted && !isAdmin &&
          <div className={styles.ButtonFormContainer}>
            <div className={styles.line}>
              <div className={styles.ButtonForm} >
                <button className={styles.submitButton} onClick={() => continueToMy_Campaigns()}>
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
          submitted && !isAdmin &&
          <div className={styles.ButtonFormContainer}>
            <div className={styles.line}>
              <div className={styles.ButtonForm}>
                <a href={window.location.href} >
                  <button className={styles.submitButton}>
                      Do Other Update
                  </button>
                </a>
              </div>
              <div className={styles.ButtonForm}>
                <button className={styles.submitButtonUpdate} onClick={() => continueToMy_Campaigns()}>
                    Continue
                </button>
              </div>
            </div>
          </div>
          
        }
        {isAdmin && (
      <div className={styles.ButtonFormContainer}>
        <div className={styles.line}>
          <div className={styles.ButtonForm}>
            <button className={styles.submitButton} onClick={() => sendUpdateStatus(campaign.id!,CampaignStatus.Active.toString())}>Accept</button>
          </div>
          <div className={styles.ButtonForm}>
            <button className={styles.submitButtonUpdate} onClick={() => sendUpdateStatus(campaign.id!,CampaignStatus.Reproved.toString())}>Deny</button>
          </div>
        </div>
      </div>
    )}
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

function getBadgeWithType(campaign:Campaign,type:BadgeTypes) : Badge | null
{
  const campaignBadge = (campaign.badges.value as CampaignBadge[]).find( 
    (campaignBadge) => (campaignBadge.badge.value as Badge).type === type
  ) 

  return (campaignBadge?.badge.value! as Badge) as Badge;
}

const formatDateToYYYYMMDD = (date:Date) => {
  let a = new Date(date) 
  return `${a.getFullYear()}-${a.getMonth()+1}-${a.getDate()}`;
}

export default EditCampaignForm;