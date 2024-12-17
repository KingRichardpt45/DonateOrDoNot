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
import { UserRoleTypes } from "@/models/types/UserRoleTypes";

interface SideMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
  userType:number
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, toggleMenu ,userType}) => {
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
              <a href="/SearchPage">
                <span className={styles.iconContainer}>
                  <Search size={20} />
                </span>
                Search
              </a>
            </li>
            {
              (userType == UserRoleTypes.Donor || userType == UserRoleTypes.Admin) &&
              <li>
                <a href="#">
                  <span className={styles.iconContainer}>
                    <Store size={20} />
                  </span>
                  Store
                </a>
              </li>
            }
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
            {
              (userType == UserRoleTypes.Donor) &&
              <li>
                <a href="/my_donations">
                  <span className={styles.iconContainer}>
                    <DollarSign size={20} />
                  </span>
                  My Donations
                </a>
              </li>
            }
            {
              (userType == UserRoleTypes.CampaignManager) &&
              <li>
                <a href="/campaigns/my_campaigns">
                  <span className={styles.iconContainer}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24"><path fill="white" d="M18 13v-2h4v2zm1.2 7L16 17.6l1.2-1.6l3.2 2.4zm-2-12L16 6.4L19.2 4l1.2 1.6zM5 19v-4H4q-.825 0-1.412-.587T2 13v-2q0-.825.588-1.412T4 9h4l5-3v12l-5-3H7v4zm9-3.65v-6.7q.675.6 1.088 1.463T15.5 12t-.413 1.888T14 15.35"/></svg>
                  </span>
                  My Campaigns
                </a>
              </li>
            }
            {
              (userType == UserRoleTypes.Admin) &&
              <li>
                <a href="/admin">
                  <span className={styles.iconContainer}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 16 16"><path fill="white" fill-rule="evenodd" d="m7.879 5l1.06-1.06l1.421-1.422a3.5 3.5 0 0 0-3.653 4.674l.326.897l-.675.674l-3.797 3.798a.621.621 0 1 0 .878.878l3.798-3.797l.674-.675l.897.325a3.5 3.5 0 0 0 4.674-3.653L12.06 7.062L11 8.12L9.94 7.06l-1-1zm6.173-1.93A5 5 0 0 1 15 6a5 5 0 0 1-6.703 4.703L4.5 14.5a2.121 2.121 0 0 1-3-3l3.797-3.797A5 5 0 0 1 13 2l-1.076 1.076l-.863.863L10 5l1 1l1.06-1.06l.864-.864L14 3z" clip-rule="evenodd"/></svg>
                  </span>
                  My Donations
                </a>
              </li>
            }
            
          </ul>
        </div>

        <div className={styles.menuGroup}>
          <ul>
            <li>
              <a href="/profile">
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
