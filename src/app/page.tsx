"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import SideMenu from "./components/SideMenu";
import {Header} from "./components/NavBarNotLogged";
import {ExpandableSearchBar} from "./components/searchBar";
import Campaign from "./components/campaign"

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.campaignContent}>
          <h1 className={styles.campaignTitle}>Campaign Title</h1>
          <p className={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            consequat lacus ut tortor luctus venenatis. Sed vehicula nisl nec
            diam hendrerit luctus.
          </p>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div className={styles.progress}></div>
            </div>
            <p className={styles.progressText}>1000€ (10% of 10000€)</p>
          </div>
          <div className={styles.donationOptions}>
            <p>1€ = 20 bottles of water</p>
            <p>1€ - 20 water bottles</p>
            <p>5€ - 100 water bottles and food</p>
            <p>10€ - 200 water bottles, food and clothes</p>
          </div>
          
        </div>
      </main>
      <div className={styles.footerContent}>
        <p>Be one of this campaign top Donors !</p>
        <button className={styles.donateButton}>Donate Now</button>
      </div>
      <footer className={styles.footer}>
        © UMa PMS Grupo 5
      </footer>
    </div>
  );
}
