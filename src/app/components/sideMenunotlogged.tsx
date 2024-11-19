"use client";


import React from "react";
import styles from "./components.module.css";
import { 
  Home,
  User,
  LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SideMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const SideMenuNL: React.FC<SideMenuProps> = ({ isOpen, toggleMenu }) => {
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
              <button 
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                <span className={styles.iconContainer}>
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

export default SideMenuNL;
