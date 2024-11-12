"use client";

import styles from "../components/authentication.module.css";
import SideMenu from "../components/SideMenu";
import { Header } from "../components/NavBarNotLogged";

export default function SignIn() {
  return (
    <div className={styles.page}>
      <Header />
      <SideMenu />
      <main className={styles.main}>
        <div className={styles.signContainer}>
          <h2 className={styles.heading}>Sign In</h2>
          <form className={styles.signForm}>
            <input
              type="email"
              className={styles.inputField}
              placeholder="Email"
            />
            <input
              type="password"
              className={styles.inputField}
              placeholder="Password"
            />

            <div className={styles.signLink}>
            Forgot Your Password? <a href="/ForgotPassword" className={styles.link}>Click Here!</a>
            </div>
            <div className={styles.signLink}>
            Want to create an account? <a href="/SignUp" className={styles.link}>Click Here!</a>
            </div>

            <button type="submit" className={styles.submitButton}>
              Sign Up
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
