import Link from 'next/link';
import styles from './notAuthorized.tsx.module.css'

const NotAuthorized = () => {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>403 - Forbidden</h1>
        <p className={styles.message}>You do not have access to this page.</p>
          <a  href="/" className={styles.link}>Go back to Home</a>
      </div>
    );
  };
  
  export default NotAuthorized;