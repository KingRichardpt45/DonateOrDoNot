import EditCampaignForm from "@/app/components/campaigns/edit/EditCampaignForm";
import styles from "../page.module.css";

export default function CampaignCreate() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Edit Campaign</h1>
        <EditCampaignForm/>
      </main>
    </div>
  );
}
