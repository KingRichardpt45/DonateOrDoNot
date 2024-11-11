"use client"; 

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import SideMenu from "./components/SideMenu"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className={styles.page}>
      <button onClick={toggleMenu} className={styles.menuButton}>
        Open Menu
      </button>
      <main className={styles.main}>
      <SideMenu/>
       </main>
    </div>
  );
}
