"use client";
import React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from './Button';
import styles from './components.module.css';
import Image from 'next/image';
import { ExpandableSearchBar } from './searchBar';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header__left}>
        <Link href="/" className={styles.header__logo}>
          <Image 
            src="/images/logo.png"
            alt="Donate Or Donot Logo"
            width={40}
            height={40}
            className={styles.logo_image}
          />
          Donate Or Donot
        </Link>
      </div>
      <ExpandableSearchBar />
      <Link href="/SignUp">
      <Button variant="ghost" className={styles.header__signup_button}>
        Sign Up
      </Button>
    </Link>
    </header>
  );
};
