"use client"; // Indicating that this is a client-side component
import { useState } from "react";
import styles from "./campaignsAdmin.module.css";

interface CampaignManagerActionProps {
  managerId: number,// The manager ID passed to the action buttons
  onDenied:(managerId:number)=>void
  onAccept:(managerId:number)=>void
}

async function PatchCampaignManager(managerId: number,denied:boolean) {
    if (!managerId) {
      throw new Error("Manager ID is required.");
    }
    // Make the POST request to verify the campaign manager
    const formData  = new FormData();
    formData.set("denied", denied ? "1":"0");

    const response = await fetch(`/api/account/${managerId}`, {
      method: "POST",
      body:formData
    });
  
    return response;
  }

const CampaignManagerAction: React.FC<CampaignManagerActionProps> = ({ managerId ,onDenied ,onAccept}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (action: "accept" | "deny") => {
    setLoading(true);
    setError(null);

    try {
      const response = await PatchCampaignManager(managerId,action=="deny");
      if (response.ok && action === "accept") {
        onAccept(managerId);
      } else if (response.ok && action === "deny") {
        onDenied(managerId);
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <div className={styles.actionDisplay}>
        <button
          className={styles.acceptButton}
          onClick={() => handleAction("accept")}
          disabled={loading}
        >
          {loading ? "Processing..." : "Accept"}
        </button>
        <button
          className={styles.denyButton}
          onClick={() => handleAction("deny")}
          disabled={loading}
        >
          {loading ? "Processing..." : "Deny"}
        </button>
      </div>
    </div>
  );
};

export default CampaignManagerAction;
