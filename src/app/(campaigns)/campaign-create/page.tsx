"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function CampaignCreate() {

  const [images, setImages] = useState<File[]>([]); // Store File objects, not URLs
  const [videos, setVideos] = useState<File[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  //Adds new file to the image list
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      setImages((prevImages) => [...prevImages, ...newImages]);

    }
  };

  //removes the selected image from the image list
  const removeImage = (index: number) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      return updatedImages;
    });
  };

  //Adds new file to the video list
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newVideos = Array.from(files);
      setVideos((prevVideos) => [...prevVideos, ...newVideos]);
    }
  };

  //removes the selected video from the video list
  const removeVideo = (index: number) => {
    setVideos((prevVideos) => prevVideos.filter((_, i) => i !== index));
  };

  //Adds new file to the file list
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  //removes the selected file from the file list
  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));

  };

  //render for file previews 
  const renderFilePreview = (file: File) => {
    const fileType = file.type;
    if (fileType.startsWith("image/")) {
      return <img src={URL.createObjectURL(file)} alt={file.name} className={styles.previewImage} />;
    } else if (fileType.startsWith("video/")) {
      return <video controls className={styles.previewVideo}><source src={URL.createObjectURL(file)} type={file.type} /></video>;
    } else if (fileType === "application/pdf") {
      return (
        <object data={URL.createObjectURL(file)} type="application/pdf" width="100%" height="200">
          <p>Your browser does not support PDFs. <a href={URL.createObjectURL(file)}>Download the PDF</a>.</p>
        </object>
      );
    } else if (fileType === "text/plain") {
      const [content, setContent] = useState<string | null>(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        setContent(e.target?.result as string);
      };
      reader.readAsText(file);

      return <pre className={styles.previewText}>{content}</pre>;
    } else {
      return <p>{file.name}</p>; // For unsupported file types
    }
  };


  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Create Campaign</h1>
        <div className={styles.CampaignCreateContainer}>
          <div className={styles.TextForm}>
            <div className={styles.FormTitle}><b>Title</b></div>
            <input id="Title" type="text" className={styles.inputField} placeholder="Campaign Title"/>
          </div>
          <div className={styles.TextForm}>
            <div className={styles.FormTitle}><b>Description</b></div>
            <textarea id="Description" className={styles.inputField} rows={4} placeholder="Campaign description"></textarea>
          </div>
          <div className={styles.TextForm}>
            <div className={styles.FormTitle}><b>Campaign Category</b></div>
            <div className={styles.dropdownContainer}>
              <select id="Category" className={styles.dropdown}>
                <option value="">-- Select Category --</option>
                <option value="Health">Health</option>
                <option value="School">School</option>
                <option value="StartUp">StartUp</option>
                <option value="Debt">Debt</option>
              </select>
            </div>
          </div>
          <div className={styles.TextForm}>
            <div className={styles.FormTitle}><b>Goal Amount</b></div>
            <input id="GoalValue" type="number" className={styles.inputField} placeholder="Goal Amount €"/>
          </div>
          <div className={styles.TextForm}>
            <div className={styles.FormTitle}><b>End Date</b></div>
            <input id="EndDate" type="date" className={styles.inputField}/>
          </div>
          {/* Campaign Images Upload */}
          <div className={styles.fileForm}>
            <div className={styles.fileFormTitle}>
              <b>Campaign Images</b>
            </div>
            <input
              type="file"
              name="campaignImage"
              accept="image/png, image/gif, image/jpeg"
              multiple
              onChange={handleImageUpload}
            />
          </div>
          <div className={styles.filePreviewContainer}>
            {images.map((image, index) => (
              <div key={index} className={styles.imagePreview}>
                <img
                  src={URL.createObjectURL(image)} // Generate the object URL when rendering
                  alt={`Preview ${index + 1}`}
                  className={styles.previewImage}
                />
                <button
                  onClick={() => removeImage(index)}
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
              onChange={handleVideoUpload}
            />
          </div>
          <div className={styles.filePreviewContainer}>
            {videos.map((video, index) => (
              <div key={index} className={styles.videoPreview}>
                <video
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
                </button>
              </div>
            ))}
          </div>
          {/* Campaign File Upload */}
          <div className={styles.fileForm}>
            <div className={styles.fileFormTitle}><b>Campaign Files</b></div>
            <input
              type="file"
              name="campaignFile"
              accept=".pdf, .docx, .xlsx, .txt"
              multiple
              onChange={handleFileUpload}
            />
          </div>
          <div className={styles.filePreviewContainer}>
            {files.map((file, index) => (
              <div key={index} className={styles.filePreview}>
                {renderFilePreview(file)}
                <button
                  onClick={() => removeFile(index)}
                  className={styles.removeButton}
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <div className={styles.ButtonForm}>
            <button type="submit" className={styles.submitButton}>
              Create Campaign
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
