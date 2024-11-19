"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "./Button";
import styles from "./components.module.css";
import Image from "next/image";
import SideMenu from "./SideMenu";
import SideMenuNL from "./sideMenunotlogged";

export const Header: React.FC = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  return (
    <>
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
        <Link href="/signup">
          <Button variant="ghost" className={styles.header__signup_button}>
            Sign Up
          </Button>
        </Link>
      </header>

      {/* Side Menu */}
      <SideMenuNL isOpen={isSideMenuOpen} toggleMenu={toggleSideMenu} />
    </>
  );
};
