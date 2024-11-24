import styles from "../../components/authentication.module.css";
import { MainLayout } from "@/app/components/coreComponents/mainLayout";

export default function SignIn() {
  return (
    <MainLayout setUser={()=>{}}>
      <div className={styles.main}>
        <main className={styles.page}>
          <div className={styles.signContainer}>
            <h2 className={styles.heading}>Sign In</h2>
            <form action="api/account/signin" method="POST" className={styles.signForm}>
              <input
                name="email"
                type="email"
                className={styles.inputField}
                placeholder="Email"
              />
              <input
                name="password"
                type="password"
                className={styles.inputField}
                placeholder="Password"
              />

              <div className={styles.signLink}>
              Forgot Your Password? <a href="/forgotpassword" className={styles.link}>Click Here!</a>
              </div>
              <div className={styles.signLink}>
              Want to create an account? <a href="/signup" className={styles.link}>Click Here!</a>
              </div>
              <div className={styles.signLink}>
              Test Campaigns remove after? <a href="/MyCampaigns" className={styles.link}>Click Here!</a>
              </div>

              <button type="submit" className={styles.submitButton}>
                Sign in
              </button>
            </form>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
