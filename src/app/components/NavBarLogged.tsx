"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from './Button';
import styles from './components.module.css';
import Image from 'next/image';
import { ExpandableSearchBar } from './searchBar';
import { Services } from "@/services/Services";
import { IUserProvider } from "@/services/session/userProvider/IUserProvider";
import { User } from "@/models/User";
import { headers } from 'next/headers';
import { IAuthorizationService } from "@/services/session/authorizationService/IAuthorizationService";
import { UserRoleTypes } from "@/models/types/UserRoleTypes";
import { redirect } from "next/navigation"
import SideMenu from './SideMenu';

export const HeaderL: React.FC = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };
  return (
    <header className={styles.header}>
      <div className={styles.header__left}>
      <button
            className={styles.burgerButton}
            onClick={toggleSideMenu}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
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
      <div className={styles.header__user_info}>
            <Image
              src={""}
              alt={`${User.name}'s profile`}
              width={40}
              height={40}
              className={styles.header__user_photo}
            />
            <span className={styles.header__user_name}>{User.name}</span>
          </div>
          {/* Side Menu */}
      <SideMenu isOpen={isSideMenuOpen} toggleMenu={toggleSideMenu} />
    </header>
  );
};
