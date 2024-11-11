"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import SideMenu from "./components/SideMenu";

export default function Home() {
  return (
    <div className={styles.page}>
      <SideMenu />
      <main className={styles.main}>
        <h1>Welcome to Your App</h1>
        <p>This is the main content area.</p>
        
      </main>
    </div>
  );
}