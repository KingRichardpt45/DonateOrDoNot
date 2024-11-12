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
    <div className="container">
      <Campaign/>
    </div>
  );
}
