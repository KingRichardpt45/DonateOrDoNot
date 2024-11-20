"use client";

import styles from "../components/authentication.module.css";

export default function SignIn() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.signContainer}>
          <h2 className={styles.heading}>Forgot your password</h2>
          <form className={styles.signForm}>
            <input
              type="email"
              className={styles.inputField}
              placeholder="Email"
            />
           

            <div className={styles.signLink}>
            I already have an account! <a href="/SignIn" className={styles.link}>Click Here!</a>
            </div>
            <div className={styles.signLink}>
            Want to create an account? <a href="/SignUp" className={styles.link}>Click Here!</a>
            </div>

            <button type="submit" className={styles.submitButton}>
              Send Email
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
