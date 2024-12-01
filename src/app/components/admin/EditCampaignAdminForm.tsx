"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './EditCampaignAdminForm.module.css'

import { BadgeTypes } from "@/models/types/BadgeTypes";
import { FileTypes } from "@/models/types/FileTypes";
import { ActionDisplay } from "../actionsNotifications/actionDisplay/ActionDisplay";
import { File as ModelFIle} from "@/models/File";
import { Campaign } from "@/models/Campaign";
import { Badge } from "@/models/Badge";
import { CampaignBadge } from "@/models/CampaignBadge";
import { BankAccount } from "@/models/BankAccount";
import { array } from "yup";
import { StringUtils } from "@/core/utils/StringUtils";

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

const EditCampaignAdminForm: React.FC<{ campaign: Campaign; userId: number }> = ({ campaign, userId }) => {
  const campaignid  = campaign.id;
  const campaignidstring = campaignid?.toString();
  
  // Rename the local state to avoid conflict with props
  const [localCampaign, setLocalCampaign] = useState<Campaign | null>(campaign);
  const [badgeFamily, setBadgeFamily] = useState<Badge | null>(null);
  const [badgeHelper, setBadgeHelper] = useState<Badge | null>(null);
  const [badgePartner, setBadgePartner] = useState<Badge | null>(null);
  const [badgeFamilyFile, setBadgeFamilyFile] = useState<File | null>(null);
  const [badgeHelperFile, setBadgeHelperFile] = useState<File | null>(null);
  const [badgePartnerFile, setBadgePartnerFile] = useState<File | null>(null);
  const [fieldsValue, setFieldsValue] = useState<Map<string, string>>(new Map());
  const [mainImage, setMainImage] = useState<ModelFIle[]>([]);
  const [mainImageAdded, setMainImageAdded] = useState<File | null>(null);
  const [images, setImages] = useState<ModelFIle[]>([]);
  const [imagesAdded, setImagesAdded] = useState<Map<string, File>>(new Map());
  const [videos, setVideos] = useState<ModelFIle[]>([]);
  const [videosAdded, setVideosAdded] = useState<Map<string, File>>(new Map());
  const [files, setFiles] = useState<ModelFIle[]>([]);
  const [filesAdded, setFilesAdded] = useState<Map<string, File>>(new Map());
  const [removedFiles, setRemovedFiles] = useState<ModelFIle[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [actions, setActions] = useState<string[]>([]);

  useEffect(() => {
    // If campaignid is available, fetch the campaign data
    if (campaignid) {
      fetchCampaign(campaignidstring!);
    }
  }, [campaignid]);

  const fetchCampaign = async (campaignId: string) => {
    // Replace with actual fetching logic (e.g., API call)
    const campaignData: Campaign = await fetch(`/api/campaigns/${campaignId}`).then(res => res.json());
    setLocalCampaign(campaignData);  // Update the state with the fetched campaign data

    // Populate fields with badges if available
    if (campaignData?.badges?.value) {
      setBadgeFamily(getBadgeWithType(campaignData, BadgeTypes.CampaignFamily));
      setBadgeHelper(getBadgeWithType(campaignData, BadgeTypes.CampaignHelper));
      setBadgePartner(getBadgeWithType(campaignData, BadgeTypes.CampaignPartner));
    }
  };

  const getBadgeWithType = (campaign: Campaign, type: BadgeTypes): Badge | null => {
    // Find the campaign badge
    const campaignBadge = (campaign.badges.value as CampaignBadge[]).find(
      (campaignBadge) => (campaignBadge.badge.value as Badge).type === type
    );
    
    // Ensure the badge is a single Badge, not an array
    const badge = campaignBadge?.badge.value;
  
    if (Array.isArray(badge)) {
      // Handle the case where badge.value is an array (if this is expected in some cases)
      return badge[0] || null; // Or handle it as appropriate for your application
    }
  
    // Return the badge directly if it's a single Badge
    return badge || null;
  };
  const handleSubmit = () => {
    setSubmitted(true);
    setActions(['Campaign updated successfully']);
  };

  

  const updateField = (field: string, entityType: string, value: string, type: BadgeTypes) => {
    fieldsValue.set(field, value);
    setFieldsValue(new Map(fieldsValue));  // Trigger re-render
  };

  const removeFile = (file: ModelFIle, list: ModelFIle[], setList: React.Dispatch<React.SetStateAction<ModelFIle[]>>) => {
    setList(list.filter(f => f.id !== file.id));
    setRemovedFiles([...removedFiles, file]);
  };

  const removeAddedFile = (file: File, list: Map<string, File>) => {
    list.delete(file.name);
    setFilesAdded(new Map(list));
  };

  const addFile = (files: FileList, list: Map<string, File>) => {
    Array.from(files).forEach(file => {
      list.set(file.name, file);
    });
    setFilesAdded(new Map(list));
  };

  return (
    <div className={styles.FormContainer}>
      <div className={styles.TextForm}><b>Badges</b></div>
      <div className={styles.badgesContainerContainer}>
        <div className={styles.badgesContainer}>
          {/* Badge Family */}
          <div className={styles.badgeContainer}>
            <div className={styles.TextForm}>Family</div>
            <div className={styles.imagePlaceHolder}>
              {badgeFamily && badgeFamily.image.value && (
                <img
                  src={`/documents/${(badgeFamily.image.value as ModelFIle).id}_${(badgeFamily.image.value as ModelFIle).original_name}`}
                  alt="Preview"
                  className={styles.previewBadgeImage}
                />
              )}
              {badgeFamilyFile && !badgeFamily?.image.value && (
                <img src={URL.createObjectURL(badgeFamilyFile)} alt={badgeFamilyFile.name} className={styles.previewImage} />
              )}
            </div>
            <input
              className={styles.badgeInput}
              type="file"
              id="badge_image"
              name="campaign_image"
              accept="image/png, image/gif, image/jpeg"
              onChange={(e) => {
                if (e.target.files) {
                  setBadgeFamilyFile(e.target.files[0]);
                  setBadgeFamily(null);
                }
              }}
            />
            <input
              type="text"
              placeholder="Name"
              className={`${styles.inputFieldBank}`}
              value={fieldsValue.get(`${BadgeTypes.CampaignFamily}_name`)}
              onChange={(e) => updateField(`${BadgeTypes.CampaignFamily}_name`, 'BADGE', e.target.value, BadgeTypes.CampaignFamily)}
            />
            <input
              type="text"
              className={`${styles.inputFieldBank}`}
              value={fieldsValue.get(`${BadgeTypes.CampaignFamily}_description`)}
              onChange={(e) => updateField(`${BadgeTypes.CampaignFamily}_description`, 'BADGE', e.target.value, BadgeTypes.CampaignFamily)}
              placeholder="Description"
            />
          </div>

          {/* Badge Helper */}
          <div className={styles.badgeContainer}>
            <div className={styles.TextForm}>Helper</div>
            <div className={styles.imagePlaceHolder}>
              {badgeHelper && badgeHelper.image.value && (
                <img
                  src={`/documents/${(badgeHelper.image.value as ModelFIle).id}_${(badgeHelper.image.value as ModelFIle).original_name}`}
                  alt="Preview"
                  className={styles.previewBadgeImage}
                />
              )}
              {badgeHelperFile && !badgeHelper?.image.value && (
                <img src={URL.createObjectURL(badgeHelperFile)} alt={badgeHelperFile.name} className={styles.previewImage} />
              )}
            </div>
            <input
              className={styles.badgeInput}
              type="file"
              id="badge_image"
              name="campaign_image"
              accept="image/png, image/gif, image/jpeg"
              onChange={(e) => {
                if (e.target.files) {
                  setBadgeHelperFile(e.target.files[0]);
                  setBadgeHelper(null);
                }
              }}
            />
            <input
              type="text"
              placeholder="Name"
              className={`${styles.inputFieldBank}`}
              value={fieldsValue.get(`${BadgeTypes.CampaignHelper}_name`)}
              onChange={(e) => updateField(`${BadgeTypes.CampaignHelper}_name`, 'BADGE', e.target.value, BadgeTypes.CampaignHelper)}
            />
            <input
              type="text"
              className={`${styles.inputFieldBank}`}
              value={fieldsValue.get(`${BadgeTypes.CampaignHelper}_description`)}
              onChange={(e) => updateField(`${BadgeTypes.CampaignHelper}_description`, 'BADGE', e.target.value, BadgeTypes.CampaignHelper)}
            />
          </div>

          {/* Badge Partner */}
          <div className={styles.badgeContainer}>
            <div className={styles.TextForm}>Partner</div>
            <div className={styles.imagePlaceHolder}>
              {badgePartner && badgePartner.image.value && (
                <img
                  src={`/documents/${(badgePartner.image.value as ModelFIle).id}_${(badgePartner.image.value as ModelFIle).original_name}`}
                  alt="Preview"
                  className={styles.previewBadgeImage}
                />
              )}
              {badgePartnerFile && !badgePartner?.image.value && (
                <img src={URL.createObjectURL(badgePartnerFile)} alt={badgePartnerFile.name} className={styles.previewImage} />
              )}
            </div>
            <input
              className={styles.badgeInput}
              type="file"
              id="badge_image"
              name="campaign_image"
              accept="image/png, image/gif, image/jpeg"
              onChange={(e) => {
                if (e.target.files) {
                  setBadgePartnerFile(e.target.files[0]);
                  setBadgePartner(null);
                }
              }}
            />
            <input
              type="text"
              placeholder="Name"
              className={`${styles.inputFieldBank}`}
              value={fieldsValue.get(`${BadgeTypes.CampaignPartner}_name`)}
              onChange={(e) => updateField(`${BadgeTypes.CampaignPartner}_name`, 'BADGE', e.target.value, BadgeTypes.CampaignPartner)}
            />
            <input
              type="text"
              className={`${styles.inputFieldBank}`}
              value={fieldsValue.get(`${BadgeTypes.CampaignPartner}_description`)}
              onChange={(e) => updateField(`${BadgeTypes.CampaignPartner}_description`, 'BADGE', e.target.value, BadgeTypes.CampaignPartner)}
            />
          </div>
        </div>
      </div>

      <div className={styles.ButtonFormContainer}>
        <button className={styles.submitButton} onClick={handleSubmit}>
          Update Campaign
        </button>
        <button className={styles.cancelButton}>
          Cancel
        </button>
      </div>

      
    </div>
  );
};

export default EditCampaignAdminForm;
