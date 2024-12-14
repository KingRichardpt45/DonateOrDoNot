"use client"; // Indicating that this is a client-side component
import { useState } from "react";

interface CampaignManagerActionProps {
  managerId: number; // The manager ID passed to the action buttons
}

async function PatchCampaignManager(managerId: number) {
    if (!managerId) {
      throw new Error("Manager ID is required.");
    }
    console.log(managerId);
    // Make the POST request to verify the campaign manager
    const response = await fetch(`/api/account/${managerId}`, {
      method: "POST",
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to verify campaign manager. Server responded with: ${errorData.message || response.statusText}`
      );
    }
  
    return response;
  }

const CampaignManagerAction: React.FC<CampaignManagerActionProps> = ({ managerId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (action: "accept" | "deny") => {
    setLoading(true);
    setError(null);

    try {
      const response = await PatchCampaignManager(managerId);
      if (action === "accept") {
        // Handle acceptance logic here (e.g., update UI state)
      } else if (action === "deny") {
        // Handle denial logic here
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
      <div className="actionButtons">
        <button
          className="acceptButton"
          onClick={() => handleAction("accept")}
          disabled={loading}
        >
          {loading ? "Processing..." : "Accept"}
        </button>
        <button
          className="denyButton"
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
