"use client";

import Image from "next/image";
import styles from "../components/authentication.module.css"
import { useEffect, useState } from "react";
import SideMenu from "../components/SideMenu";
import {Header} from "../components/NavBarNotLogged";

export default function SignUp() {
  return (
    <div className={styles.page}>
      <Header />
      <SideMenu/>
      <main className={styles.main}>
      </main>
      
      <footer className={styles.footer}>
        © UMa PMS Grupo 5
      </footer>
    </div>
  );
}
