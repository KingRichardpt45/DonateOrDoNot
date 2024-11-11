import React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from './Button';
import styles from './components.module.css'; // Import CSS module specifically for Header styles
import Image  from 'next/image';
import {ExpandableSearchBar} from "./searchBar"



export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header__left}>
        
        <Link href="/" className={styles.header__logo}>
        <Image 
            src="/images/logo.png" // Path to the image in the public folder
            alt="Donate Or Donot Logo"
            width={40}        // Set the desired width
            height={40}       // Set the desired height
            className={styles.logo_image} // Optional: Add specific styling
          />
          Donate Or Donot
        </Link>
      </div>
      <ExpandableSearchBar/>
      <Button variant="ghost" className={styles.header__login_button}>
        Login
      </Button>
    </header>
  );
};
