"use client";
import React from 'react';
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

export const HeaderL: React.FC = () => {
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
    </header>
  );
};
