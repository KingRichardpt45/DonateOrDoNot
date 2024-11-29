import Link from 'next/link';
import styles from './notLogged.module.css';

const NotLoggedIn = () => {
  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h1 className={styles.title}>Access Denied</h1>
        <p className={styles.message}>
          You need to sign in to access this page.
        </p>
        <a href="/signin" className={styles.link}>
          Go to Sign In
        </a>
      </div>
    </div>
  );
};

export default NotLoggedIn;
