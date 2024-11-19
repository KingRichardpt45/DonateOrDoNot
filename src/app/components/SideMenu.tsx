"use client";

import React from "react";
import styles from "./components.module.css";
import {
  Home,
  Search,
  Store,
  Trophy,
  Clock,
  BarChart2,
  DollarSign,
  User,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SideMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, toggleMenu }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/account/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <div
      className={`${styles.sideMenu} ${isOpen ? styles.open : styles.closed}`}
    >
      <button
        className={styles.closeButton}
        onClick={toggleMenu}
        aria-label="Close menu"
      >
        ✕
      </button>
      <nav className={styles.sideMenuNav}>
        <div className={styles.menuGroup}>
          <ul>
            <li>
              <a href="/">
                <span className={styles.iconContainer}>
                  <Home size={20} />
                </span>
                Home
              </a>
            </li>
            <li>
              <a href="/Search">
                <span className={styles.iconContainer}>
                  <Search size={20} />
                </span>
                Search
              </a>
            </li>
            <li>
              <a href="#">
                <span className={styles.iconContainer}>
                  <Store size={20} />
                </span>
                Store
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.menuGroup}>
          <ul>
            <li>
              <a href="#">
                <span className={styles.iconContainer}>
                  <Trophy size={20} />
                </span>
                Biggest Donors
              </a>
            </li>
            <li>
              <a href="#">
                <span className={styles.iconContainer}>
                  <Clock size={20} />
                </span>
                Most Frequent Donors
              </a>
            </li>
            <li>
              <a href="#">
                <span className={styles.iconContainer}>
                  <BarChart2 size={20} />
                </span>
                Most Donations
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.menuGroup}>
          <ul>
            <li>
              <a href="#">
                <span className={styles.iconContainer}>
                  <DollarSign size={20} />
                </span>
                My Donations
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.menuGroup}>
          <ul>
            <li>
              <a href="#">
                <span className={styles.iconContainer}>
                  <User size={20} />
                </span>
                Profile
              </a>
            </li>
            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>
                <span className="iconContainer">
                  <LogOut size={20} />
                </span>
                Log out
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default SideMenu;
