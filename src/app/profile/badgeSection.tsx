import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./profile.module.css";
import {File as ModelFile} from "@/models/File";

interface BadgeProps {
  badges: any[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

const BadgesSection: React.FC<BadgeProps> = ({
  badges,
  currentPage,
  itemsPerPage,
  totalPages,
}) => {
  const indexOfLastBadge = currentPage * itemsPerPage;
  const indexOfFirstBadge = indexOfLastBadge - itemsPerPage;
  const currentBadges = badges.slice(indexOfFirstBadge, indexOfLastBadge);
  const totalBadges = badges.length;

  return (
    <div className={styles.MyBadges}>
      <div className={styles.BadgesHeader}>
        <h2>My Badges</h2>
        <span className={styles.TotalBadges}>Number of Badges: {totalBadges}</span>
      </div>
      <div className={styles.BadgesGrid}>
        {currentBadges && currentBadges.length > 0 ? (
          currentBadges.map((badge, index) => {
            const imagePathBadge = `/documents/${badge.image_id}_${
              (badge.image.value as ModelFile).original_name
            }`;

            return (
              <div key={index} className={styles.BadgeItem}>
                <Image
                  src={imagePathBadge}
                  alt={badge.name || "Badge"}
                  className={styles.BadgeImage}
                  width={50}
                  height={50}
                />
                <p>{badge.name}</p>
              </div>
            );
          })
        ) : (
          <p>No badges earned yet</p>
        )}
      </div>

      <div className={styles.Pagination}>
        {[...Array(totalPages)].map((_, i) => (
          <Link
            key={i}
            href={`?badgesPage=${i + 1}`}
            className={currentPage === i + 1 ? styles.Active : ""}
          >
            {i + 1}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BadgesSection;
