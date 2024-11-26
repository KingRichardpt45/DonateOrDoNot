"use client";

import { useState } from "react";
import styles from "../EditCampaignForm/EditCampaignForm.module.css";

export default function EditCampaignForm() {
  // Initial state with prefilled values
  const [images, setImages] = useState<File[]>([
    new File([""], "sample-image.jpg", { type: "image/jpeg" }),
  ]);
  const [videos, setVideos] = useState<File[]>([
    new File([""], "sample-video.mp4", { type: "video/mp4" }),
  ]);
  const [files, setFiles] = useState<File[]>([
    new File([""], "sample-file.pdf", { type: "application/pdf" }),
  ]);
  const [title, setTitle] = useState("Sample Campaign Title");
  const [description, setDescription] = useState("This is a sample description for the campaign.");
  const [category, setCategory] = useState("Health");
  const [goal, setGoal] = useState(1000);
  const [endDate, setEndDate] = useState("2024-12-31");

  // Handlers for adding and removing files
  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFileState: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setFileState((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (
    index: number,
    setFileState: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    setFileState((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const renderFilePreview = (file: File) => {
    const fileType = file.type;
    if (fileType.startsWith("image/")) {
      return <img src={URL.createObjectURL(file)} alt={file.name} className={styles.previewImage} />;
    } else if (fileType.startsWith("video/")) {
      return (
        <video controls className={styles.previewVideo}>
          <source src={URL.createObjectURL(file)} type={file.type} />
        </video>
      );
    } else if (fileType === "application/pdf") {
      return (
        <object data={URL.createObjectURL(file)} type="application/pdf" width="100%" height="200">
          <p>
            Your browser does not support PDFs. <a href={URL.createObjectURL(file)}>Download the PDF</a>.
          </p>
        </object>
      );
    } else {
      return <p>{file.name}</p>; // For unsupported file types
    }
  };

  return (
    <div className={styles.CampaignCreateContainer}>
        {/* Pre-filled Title */}
        <div className={styles.TextForm}>
        <div className={styles.FormTitle}><b>Title</b></div>
        <input
            id="Title"
            type="text"
            className={styles.inputField}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
        </div>
        {/* Pre-filled Description */}
        <div className={styles.TextForm}>
        <div className={styles.FormTitle}><b>Description</b></div>
        <textarea
            id="Description"
            className={styles.inputField}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        />
        </div>
        {/* Pre-selected Category */}
        <div className={styles.TextForm}>
        <div className={styles.FormTitle}><b>Campaign Category</b></div>
        <div className={styles.dropdownContainer}>
            <select
            id="Category"
            className={styles.dropdown}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            >
            <option value="">-- Select Category --</option>
            <option value="Health">Health</option>
            <option value="School">School</option>
            <option value="StartUp">StartUp</option>
            <option value="Debt">Debt</option>
            </select>
        </div>
        </div>
        {/* Pre-filled Goal Amount */}
        <div className={styles.TextForm}>
        <div className={styles.FormTitle}><b>Goal Amount</b></div>
        <input
            id="GoalValue"
            type="number"
            className={styles.inputField}
            value={goal}
            onChange={(e) => setGoal(Number(e.target.value))}
        />
        </div>
        {/* Pre-filled End Date */}
        <div className={styles.TextForm}>
        <div className={styles.FormTitle}><b>End Date</b></div>
        <input
            id="EndDate"
            type="date"
            className={styles.inputField}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
        />
        </div>
        {/* Campaign Images Upload */}
        <div className={styles.fileForm}>
        <div className={styles.fileFormTitle}><b>Campaign Images</b></div>
        <input
            type="file"
            name="campaignImage"
            accept="image/png, image/gif, image/jpeg"
            multiple
            onChange={(e) => handleFileUpload(e, setImages)}
        />
        </div>
        <div className={styles.filePreviewContainer}>
        {images.map((image, index) => (
            <div key={index} className={styles.imagePreview}>
            {renderFilePreview(image)}
            <button
                onClick={() => removeFile(index, setImages)}
                className={styles.removeButton}
            >
                X
            </button>
            </div>
        ))}
        </div>
        {/* Campaign Videos Upload */}
        <div className={styles.fileForm}>
        <div className={styles.fileFormTitle}><b>Campaign Videos</b></div>
        <input
            type="file"
            name="campaignVideo"
            accept="video/mp4,video/x-m4v,video/*"
            multiple
            onChange={(e) => handleFileUpload(e, setVideos)}
        />
        </div>
        <div className={styles.filePreviewContainer}>
        {videos.map((video, index) => (
            <div key={index} className={styles.videoPreview}>
            {renderFilePreview(video)}
            <button
                onClick={() => removeFile(index, setVideos)}
                className={styles.removeButton}
            >
                X
            </button>
            </div>
        ))}
        </div>
        {/* Campaign Files Upload */}
        <div className={styles.fileForm}>
        <div className={styles.fileFormTitle}><b>Campaign Files</b></div>
        <input
            type="file"
            name="campaignFile"
            accept=".pdf, .docx, .xlsx, .txt"
            multiple
            onChange={(e) => handleFileUpload(e, setFiles)}
        />
        </div>
        <div className={styles.filePreviewContainer}>
        {files.map((file, index) => (
            <div key={index} className={styles.filePreview}>
            {renderFilePreview(file)}
            <button
                onClick={() => removeFile(index, setFiles)}
                className={styles.removeButton}
            >
                X
            </button>
            </div>
        ))}
        </div>
        <div className={styles.ButtonForm}>
        <button type="submit" className={styles.submitButton}>
            Edit Campaign
        </button>
        </div>
    </div>
  );
}
